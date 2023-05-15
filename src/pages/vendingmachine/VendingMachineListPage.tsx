/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { LoadingButton } from '@mui/lab';
import { Box, Card, CardActions, CardContent, FormControl, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { VendingMachineDto, VendingMachineService } from '../../service/VendingMachineService';


interface IVendingMachineListPageProp {

}

const VendingMachineListPage = (props: IVendingMachineListPageProp) => {

    const [vmList, setVmList] = useState<Array<VendingMachineDto>>([]);
    const [newVmId, setNewVmId] = useState<number>();
    const [processing, setProcessing] = useState<boolean>(false);
    const navigate = useNavigate();

    const onCreateNewVm = async (vmId: number) => {
        if (!vmId) {
            alert("자판기 Id를 입력해주세요.");
            return;
        }

        if (vmId <= 0) {
            alert("자판기 Id는 0 이상의 값을 입력해야합니다.");
            return;
        }

        const duplicateVmIdLength = vmList.filter(vm => vm.id === vmId).length;
        if (duplicateVmIdLength > 0) {
            alert("동일한 자판기가 존재합니다. 목록에서 확인해주세요.");
            return;
        }
        await VendingMachineService.findVendingMachineById(vmId);
        navigate(`/vm?vmId=${vmId}`);
    };

    useEffect(() => {
        (async () => {
            const allVmList = await VendingMachineService.findAllVendingMachine();
            setVmList(allVmList);
        })();
    }, []);

    return (
        <Stack spacing={2}>
            <Stack direction="row" justifyContent='space-between'>
                <Typography variant="h2" component="div">
                    자판기 판매 페이지
                </Typography>

                <FormControl>
                    <Stack spacing={2} direction="row">
                        <TextField
                            required
                            id="outlined-required"
                            label="자판기 아이디"
                            value={newVmId ? newVmId : ''}
                            type='number'
                            onChange={(evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                setNewVmId(parseInt(evt.target.value));
                            }}
                        />
                        <LoadingButton
                            variant='contained'
                            loading={processing}
                            onClick={async () => {
                                setProcessing(true);
                                try {
                                    await onCreateNewVm(newVmId!);
                                } catch (err) {
                                    console.log(err);
                                    alert("처리중 오류가 발상했습니다. -> " + err);
                                } finally {
                                    setProcessing(false);
                                }
                            }}>
                            자판기 생성하기
                        </LoadingButton>
                    </Stack>
                </FormControl>
            </Stack>
            <Box>
                {vmList && vmList.map(vm =>
                    <Card variant='outlined' key={vm.id}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="black" gutterBottom>
                                자판기 이름: {vm.name}
                            </Typography>
                            <Typography sx={{ fontSize: 14 }} color="black" gutterBottom>
                                자판기 Id: {vm.id}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Link to={`/vm?vmId=${vm.id}`}>자판기 불러오기</Link>
                        </CardActions>
                    </Card>
                )}
            </Box>
        </Stack>
    );
};

export default VendingMachineListPage;