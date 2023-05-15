import { LoadingButton } from '@mui/lab';
import { Box, Stack } from '@mui/material';
import { ReactNode } from 'react';

interface IProductDescriptionCard {
    card: ReactNode;
    onAddCart: () => Promise<void>;
}

const ProductDescriptionCard = (props: IProductDescriptionCard) => {
    const { card, onAddCart } = props;
    return (<>

        <Stack spacing={2}>
            <Box>
                {card}
            </Box>
            <LoadingButton size='large' variant='contained' sx={{ width: 600 }} loading={false} onClick={onAddCart}>장바구니에 담기</LoadingButton>
        </Stack>
    </>);
};

export default ProductDescriptionCard;