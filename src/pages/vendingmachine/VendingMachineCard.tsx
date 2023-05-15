import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useMemo } from 'react';
import { PRODUCT_MEDIA_URL_MAP, PRODUCT_TYPE } from '../../service/VendingMachineService';

interface IVendingMachineCard {
    id: number;
    name: string;
    price: number;
    width: number;
    height: number;
    mediaHeight: number;
    onClick: () => void;
}

const VendingMachineCard = (props: IVendingMachineCard) => {

    const { id, name, price, width, height, mediaHeight, onClick } = props;

    const productType = useMemo(() => {
        switch (name) {
            case PRODUCT_TYPE.BLACK_COFFEE:
                return PRODUCT_TYPE.BLACK_COFFEE;
            case PRODUCT_TYPE.SUGAR_COFFEE:
                return PRODUCT_TYPE.SUGAR_COFFEE;
            case PRODUCT_TYPE.HAZELNUT_COFFEE:
                return PRODUCT_TYPE.HAZELNUT_COFFEE;
            default:
                throw new Error("Illigal argument");
        }
    }, [name]);

    return (
        <Card sx={{ width: width, height: height }} onClick={onClick}>
            <CardMedia sx={{ height: mediaHeight }} component="img" image={PRODUCT_MEDIA_URL_MAP.get(productType)} />
            <CardContent>
                <Box>
                    <Typography gutterBottom variant='subtitle1' component="header">{name}</Typography>
                    <Typography variant='caption'>{price}원</Typography>
                </Box>
            </CardContent>
        </Card>
    );
};
export default VendingMachineCard;