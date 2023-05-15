/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { OrderListProp, Product, VendingMachine, VendingMachineService } from '../../service/VendingMachineService';
import ProductDescriptionCard from './ProductDescriptionCard';
import ShoppingCard from './ShoppingCard';
import VendingMachineCard from './VendingMachineCard';



export enum AMOUNT_ACTION_TYPE {
    INCREASE = "increase",
    DECREASE = 'decrease'
}

const DEFAULT_USER_ID = 1;
const VendingMachineSalePage = () => {

    const [vm, setVm] = useState<VendingMachine>();
    const [menu, setMenu] = useState<Product>();
    const [orderList, setOrderList] = useState<Array<OrderListProp>>([]);
    const [remain, setRemain] = useState<number>();
    const location = useLocation();


    // 값비싼 객체? 를 생성해서 컴포넌트 사이클 동안 유지시켜야 할때 사용하는듯 하다? (재생성이 되지 않도록)
    // 레코드에서는 페이지 첫 렌더링에 레퍼런스 값들을 넣어주는 역할로 많이 쓰인다. 뭔가 store에서 유지되지 않는 값들! 렌더링에 필요없는것들!
    const testRef = useRef<any>();
    const numRef = useRef<number>(1);
    const boolRef = useRef<boolean>(false);
    const objRef = useRef<{ id?: number, name?: string; }>({});

    // objRef.current!.id = 51;
    // objRef.current!.name = 'ysChoi';
    // console.log("objRef", objRef);
    // console.log("testRef", testRef);

    useEffect(() => {
        (async () => {
            const params = new URLSearchParams(location.search);
            const validatedVmId = params.get("vmId") ? parseInt(params.get("vmId") as string) : 9999;
            const vendingMachine = await VendingMachineService.findVendingMachineById(validatedVmId);

            if (localStorage.getItem('vm:userRemain') === null) {
                localStorage.setItem('vm:userRemain', '0');
            }

            setRemain(parseInt(localStorage.getItem('vm:userRemain')!));
            setVm(vendingMachine);
        })();
    }, []);

    const addShoppingCart = async (menu: Product) => {
        const duplicateOrderLengh = orderList.filter(order => order.product.id === menu.id).length;
        if (duplicateOrderLengh > 0) {
            alert("장바구니에 동일 상품이 존재합니다.");
            return;
        }
        const newCartItem = {} as OrderListProp;
        newCartItem.amount = 1;
        newCartItem.product = menu;
        newCartItem.userId = DEFAULT_USER_ID;
        newCartItem.vmId = vm!.id;

        const newOrderList = orderList.concat(newCartItem);

        const checkOrderResourceInput = newOrderList.map(order => ({ ...order, productId: order.product.id }));
        const isAvailable = await VendingMachineService.checkOrderAvailable(checkOrderResourceInput);

        if (!isAvailable) {
            alert("자판기 재료 소진으로 장바구니에 추가할 수 없습니다.");
            return;
        }
        setOrderList(newOrderList);
    };

    const updateAmount = async (productId: number, actionType: AMOUNT_ACTION_TYPE) => {
        let isOrderAvailable;
        const copyList = [...orderList].map(order => ({ ...order, productId: order.product.id }));
        const targetOrder = copyList.filter(order => order.product.id === productId);

        if (targetOrder.length <= 0) {
            throw new Error("존재하지 않는 메뉴");
        }

        switch (actionType) {
            case AMOUNT_ACTION_TYPE.INCREASE:
                targetOrder[0].amount++;
                isOrderAvailable = await VendingMachineService.checkOrderAvailable(copyList);
                break;
            case AMOUNT_ACTION_TYPE.DECREASE:
                if (targetOrder[0].amount === 1) {
                    onDeleteMenu(productId);
                    return;
                }
                targetOrder[0].amount--;
                isOrderAvailable = await VendingMachineService.checkOrderAvailable(copyList);
                break;
            default:
        }
        if (!isOrderAvailable) {
            alert("재고 부족으로, 현재 장바구니에 존재하는 메뉴만 주문할 수 있습니다.");
            return;
        }
        setOrderList(copyList);
    };

    const onDeleteMenu = (productId: number) => {
        const targetIdx = orderList.findIndex(order => order.product.id === productId);
        if (targetIdx !== -1) {
            orderList.splice(targetIdx, 1);
            setOrderList(() => [...orderList]);
        }
    };

    const returnRemain = () => {
        let total = remain!;
        const coin = [500, 100, 50, 10, 1];

        let result = "** 잔돈 **";
        coin.forEach(e => {
            const quotient = Math.floor(total / e);
            total -= quotient * e;
            result += `\n${e}원 ${quotient}개`;
        });
        setRemain(0);
        localStorage.setItem("vm:userRemain", "0");
        return result + "\n** * * **";
    };

    const afterOrderCreated = async () => {
        setMenu(undefined);
        setOrderList([]);
        const refreshVendingMachine = await VendingMachineService.findVendingMachineById(vm!.id);
        setVm(() => refreshVendingMachine);
    };

    return (
        <Box>
            <Stack spacing={2}>
                <Typography variant='h4'>
                    {vm?.name} 자판기 음료 주문하기
                </Typography>
                <Stack spacing={3} direction='row' justifyContent='space-between'>
                    <Stack spacing={3}>
                        <Typography variant='subtitle1'>
                            메뉴판
                        </Typography>
                        <Stack direction='row' spacing={2}>
                            <Typography variant='subtitle1'>
                                사용자 잔액: {remain}
                            </Typography>
                            {remain && remain > 0 ?
                                <Button variant='contained' onClick={() => { alert(returnRemain()); }}>잔돈 반환</Button>
                                :
                                <></>
                            }
                        </Stack>
                    </Stack>
                    {/* 카드를 재사용하는데, 너무 별로같이 재사용했다. */}
                    <Stack spacing={2} direction='row'>
                        {vm && vm.menuList.map(menu => <VendingMachineCard key={menu.id} {...menu} width={200} height={200} mediaHeight={120} onClick={() => { setMenu(menu); }} />)}
                    </Stack>
                </Stack>
                <Grid container>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={4}>
                        {menu && <ProductDescriptionCard
                            card={<VendingMachineCard {...menu} width={600} height={600} mediaHeight={480} onClick={() => { return; }} />}
                            onAddCart={() => addShoppingCart(menu)}
                        />}
                    </Grid>
                    <Grid item xs={4}>
                        {orderList.length > 0 && <ShoppingCard
                            orderList={orderList}
                            remain={remain}
                            onDeleteMenu={onDeleteMenu}
                            onUpdateAmount={updateAmount}
                            setRemain={setRemain}
                            afterOrderCreated={afterOrderCreated}
                        />}
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
};
export default VendingMachineSalePage;