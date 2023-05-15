// import { Box, Button, Divider, Drawer, IconButton, Stack, TextField, Typography } from '@mui/material';
// import { OrderBeverageInput, PAYMENT_TYPE, Product } from '../../service/VendingMachineService';
// import { LoadingButton } from '@mui/lab';
// import CloseIcon from '@mui/icons-material/Close';
// import { ChangeEvent, useRef, useState } from 'react';

// // 회원 개념이 없으므로, 기본값 
// const DEFAULT_USER_ID = 1;

// interface IVendingMachineOrderFormDrawer {
//     menu: Product;
//     remain: number;
//     vmId: number;
//     setMenu: (menu: Product | undefined) => void;
//     onCreateOrder: (orderInput: OrderBeverageInput) => Promise<void>;
// }

// const CashPayForm = (props: { userRemain: number, setUserRemain: (remain: number) => void, onSubmit: () => Promise<void>; }) => {

//     const { userRemain, setUserRemain, onSubmit } = props;
//     const [processing, setProcessing] = useState<boolean>(false);
//     const moneyInputRef = useRef<HTMLInputElement | null>(null);

//     const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
//         evt.preventDefault();

//         if (userRemain > 50000) {
//             alert("50000원 초과의 금액은 입력이 불가합니다.");
//             setUserRemain(0);
//             moneyInputRef.current!.value = "";
//             return;
//         }

//         setProcessing(true);
//         try {
//             await onSubmit();
//         } catch (err) {
//             alert("orderError" + err);
//             console.log("orderError", err);
//         } finally {
//             setProcessing(false);
//         }
//     };

//     const onChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         setUserRemain(parseInt(evt.target.value));
//     };

//     return (
//         <>
//             <Typography variant='subtitle2'>
//                 현금 입력
//             </Typography>
//             <form onSubmit={handleSubmit}>
//                 <Stack spacing={1}>
//                     <TextField
//                         required
//                         ref={moneyInputRef}
//                         value={userRemain ? userRemain : ""}
//                         type='number'
//                         onChange={onChange}
//                     />
//                     <LoadingButton
//                         variant='outlined'
//                         size='medium'
//                         loading={processing}
//                         type='submit'
//                     >
//                         음료 제조하기
//                     </LoadingButton>
//                 </Stack>
//             </form>
//         </>
//     );
// };

// const CardPayForm = () => {
//     return (
//         <>
//             <Typography variant='h5'>
//                 PG 사 연동 준비중입니다! 현금결제를 이용해주세요.
//             </Typography>
//             <LoadingButton
//                 variant='outlined'
//                 size='medium'
//                 disabled={true}
//             >
//                 음료 제조하기
//             </LoadingButton>
//         </>
//     );
// };

// const VendingMachineOrderFormDrawer = (props: IVendingMachineOrderFormDrawer) => {

//     const { menu, remain, vmId, setMenu, onCreateOrder } = props;
//     const [userRemain, setUserRemain] = useState<number>(remain);
//     const [isPayWithCash, setIsPayWithCash] = useState<boolean>(true);

//     const onSubmit = async () => {
//         if (userRemain < menu.price) {
//             alert("잔액이 부족합니다.");
//             return;
//         }

//         const productId = menu.id;
//         const paymentType = isPayWithCash ? PAYMENT_TYPE.CASH : PAYMENT_TYPE.CARD;
//         const price = userRemain;
//         const userId = DEFAULT_USER_ID;

//         const orderInput: OrderBeverageInput = {
//             productId: productId,
//             paymentType: paymentType,
//             price: price,
//             userId: userId,
//             vmId: vmId
//         };
//         await onCreateOrder(orderInput);
//         setMenu(undefined);
//     };

//     return (
//         <Drawer
//             anchor='right'
//             open={!!menu}
//         >
//             <Stack spacing={4}>
//                 <Stack direction='row' justifyContent='space-between'>
//                     <Typography variant='h4'>
//                         {menu.name} 주문하기
//                     </Typography>
//                     <IconButton aria-label="close" size="large" onClick={() => setMenu(undefined)}>
//                         <CloseIcon fontSize="inherit" />
//                     </IconButton>
//                 </Stack>
//                 <Typography variant='h5'>
//                     결제금액 {menu.price}원 / 사용자 금액 {remain}원
//                 </Typography>
//                 <Divider />
//                 <Box sx={{ width: "700px" }}>
//                     <Stack spacing={1}>
//                         <Typography variant='subtitle2'>
//                             결제수단 선택하기
//                         </Typography>
//                         <Stack spacing={4} direction="row" justifyContent="space-between">
//                             <Button variant='outlined' fullWidth onClick={() => setIsPayWithCash(true)}>현금결제</Button>
//                             <Button variant='outlined' fullWidth onClick={() => setIsPayWithCash(false)}>카드결제</Button>
//                         </Stack>
//                         {isPayWithCash ?
//                             <CashPayForm
//                                 userRemain={userRemain}
//                                 setUserRemain={setUserRemain}
//                                 onSubmit={onSubmit}
//                             />
//                             :
//                             <CardPayForm />
//                         }
//                     </Stack>
//                 </Box>
//             </Stack>
//         </Drawer>
//     );
// };
// export default VendingMachineOrderFormDrawer;