import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { OrderListProp, PAYMENT_TYPE, VendingMachineService } from '../../service/VendingMachineService';
import { AMOUNT_ACTION_TYPE } from './VendingMachineSalePage';



const CashPayForm = (props: { userRemain: number, setUserRemain: (remain: number) => void, onSubmit: () => Promise<void>; }) => {

    const { userRemain, setUserRemain, onSubmit } = props;
    const [processing, setProcessing] = useState<boolean>(false);
    const moneyInputRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        if (userRemain > 50000) {
            alert("50000원 초과의 금액은 입력이 불가합니다.");
            setUserRemain(0);
            moneyInputRef.current!.value = "";
            return;
        }

        setProcessing(true);
        try {
            await onSubmit();
        } catch (err) {
            alert("orderError" + err);
            console.log("orderError", err);
        } finally {
            setProcessing(false);
        }
    };

    const onChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserRemain(parseInt(evt.target.value));
    };

    return (
        <>
            <Typography variant='h5'>
                현금 입력
            </Typography>
            <form onSubmit={handleSubmit}>
                <Stack spacing={1}>
                    <TextField
                        required
                        ref={moneyInputRef}
                        value={userRemain ? userRemain : ""}
                        type='number'
                        onChange={onChange}
                    />
                    <LoadingButton
                        variant='outlined'
                        size='medium'
                        loading={processing}
                        type='submit'
                    >
                        음료 제조하기
                    </LoadingButton>
                </Stack>
            </form>
        </>
    );
};

const CardPayForm = () => {
    return (
        <>
            <Stack spacing={8}>
                <Typography variant='h5'>
                    PG 사 연동 준비중입니다! 현금결제를 이용해주세요.
                </Typography>
                <LoadingButton
                    variant='outlined'
                    size='medium'
                    disabled={true}
                    fullWidth
                >
                    음료 제조하기
                </LoadingButton>
            </Stack>
        </>
    );
};

interface IShoppingCard {
    orderList: Array<OrderListProp>;
    remain: number | undefined;
    onDeleteMenu: (productId: number) => void;
    onUpdateAmount: (productId: number, actionType: AMOUNT_ACTION_TYPE) => Promise<void>;
    setRemain: (value: React.SetStateAction<number | undefined>) => void;
    afterOrderCreated: () => void;
}

const ShoppingCard = (props: IShoppingCard) => {

    const { orderList, remain, onDeleteMenu, onUpdateAmount, setRemain, afterOrderCreated } = props;
    const [processing, setProcessing] = useState<boolean>(false);
    const [userRemain, setUserRemain] = useState<number>(remain ? remain : 0);
    const [isPayWithCash, setIsPayWithCash] = useState<boolean>(true);

    const totalPrice = useMemo(() => {
        let price = 0;
        orderList.forEach(order => {
            price += (order.amount * order.product.price);
        });
        return price;
    }, [orderList]);

    const onSubmit = async () => {
        const paymentType = isPayWithCash ? PAYMENT_TYPE.CASH : PAYMENT_TYPE.CARD;

        if (isPayWithCash && userRemain < totalPrice) {
            alert("잔액이 부족합니다.");
            return;
        }

        const orderListInput = orderList.map(order => ({ ...order, productId: order.product.id }));
        const orderResult = await VendingMachineService.saleBeverageList(orderListInput, paymentType, userRemain);
        console.log('orderResult', orderResult);
        if (orderResult.isOrderCreated) {
            alert("음료 주문에 성공하였습니다!");
            setRemain(orderResult.price);
            localStorage.setItem("vm:userRemain", String(orderResult.price));
        } else {
            alert("음료 주문에 실패하였습니다..");
        }
        afterOrderCreated();
    };

    return (
        <>
            <Stack spacing={2} sx={{ textAlign: 'center' }}>
                <Stack spacing={4}>
                    <Typography variant='h3'>
                        장바구니
                    </Typography>
                    {orderList && orderList.map(order => <>
                        <Stack direction='row' justifyContent='space-between' key={order.product.id}>
                            <Stack direction='row' spacing={2}>
                                <Typography variant='subtitle1'>
                                    제품 명: {order.product.name}
                                </Typography>
                                <Typography variant='subtitle1'>
                                    수량: {order.amount}잔
                                </Typography>
                            </Stack>
                            <Stack direction='row' spacing={2}>
                                <LoadingButton variant='contained' loading={processing} onClick={async () => {
                                    setProcessing(true);
                                    try {
                                        await onUpdateAmount(order.product.id, AMOUNT_ACTION_TYPE.INCREASE);
                                    } catch (err) {
                                        console.log("amount increase err", err);
                                    } finally {
                                        setProcessing(false);
                                    }
                                }}> + </LoadingButton>
                                <LoadingButton variant='contained' loading={processing} onClick={async () => {
                                    setProcessing(true);
                                    try {
                                        await onUpdateAmount(order.product.id, AMOUNT_ACTION_TYPE.DECREASE);
                                    } catch (err) {
                                        console.log("amount decrease err", err);
                                    } finally {
                                        setProcessing(false);
                                    }
                                }}> - </LoadingButton>
                                <Button variant='contained' sx={{ backgroundColor: "red" }} onClick={() => onDeleteMenu(order.product.id)}>메뉴 삭제</Button>
                            </Stack>
                        </Stack>
                    </>
                    )}
                    <Stack direction='row' justifyContent='space-between'>
                        <Box>{""}</Box>
                        <Typography variant='h4'>
                            결제금액: {totalPrice}
                        </Typography>
                    </Stack>
                    <Box>
                        <Stack spacing={4} direction="row" justifyContent="space-between">
                            <Button variant='outlined' fullWidth onClick={() => setIsPayWithCash(true)}>현금결제</Button>
                            <Button variant='outlined' fullWidth onClick={() => setIsPayWithCash(false)}>카드결제</Button>
                        </Stack>
                        {isPayWithCash ?
                            <CashPayForm
                                userRemain={userRemain}
                                setUserRemain={setUserRemain}
                                onSubmit={async () => {
                                    await onSubmit();
                                }}
                            />
                            :
                            <CardPayForm />
                        }
                    </Box>
                </Stack>
            </Stack>
        </>
    );
};

export default ShoppingCard;