import { RestApiClient } from '../infra/RestApiClient';

export interface VendingMachineDto {
    id: number;
    name: string;
}

export interface VendingMachine {
    id: number;
    name: string;
    vmResource: Array<VendingMachineResource>;
    menuList: Array<Product>;
}

export interface VendingMachineResource {
    resourceId: number;
    vendingMachineId: number;
    amount: number;
}

export interface Product {
    id: number;
    name: string;
    price: number;
}

export enum PAYMENT_TYPE {
    CARD = "card",
    CASH = "cash"
}

export interface OrderBeverageInput {
    productId: number;
    vmId: number;
    paymentType: PAYMENT_TYPE;
    price: number;
    amount: number;
    userId: number;
}

export interface OrderListProp {
    product: Product;
    vmId: number;
    paymentType: PAYMENT_TYPE;
    price: number;
    amount: number;
    userId: number;
}

export interface OrderBeverageResp {
    isOrderCreated: boolean;
    price: number;
}

export interface CheckOrderResourceInput {
    productId: number;
    amount: number;
    vmId: number;
}

export interface OrderBeverageListInput {
    productId: number;
    amount: number;
    vmId: number;
    userId: number;
}

// 제품 설명 미디어 링크 Map
// 제품당 미디어가 준비돼있어야 하므로, 동적으로는 제한적 
export enum PRODUCT_TYPE {
    BLACK_COFFEE = "black coffee",
    SUGAR_COFFEE = "sugar coffee",
    HAZELNUT_COFFEE = 'hazelnut coffee'
}

export const PRODUCT_MEDIA_URL_MAP = new Map<PRODUCT_TYPE, string>([
    [PRODUCT_TYPE.BLACK_COFFEE, 'src/assets/images/americano.jpeg'],
    [PRODUCT_TYPE.SUGAR_COFFEE, 'src/assets/images/sugarcoffee.jpeg'],
    [PRODUCT_TYPE.HAZELNUT_COFFEE, 'src/assets/images/hazelnut.png'],
]);

export const PRODUCT_DESCRIPTION_MAP = new Map<PRODUCT_TYPE, string>([
    [PRODUCT_TYPE.BLACK_COFFEE, '좋은 원두로 제작한 아메리카노 입니다.'],
    [PRODUCT_TYPE.SUGAR_COFFEE, '아메리카노에 설탕을 추가한 설탕커피 입니다.'],
    [PRODUCT_TYPE.HAZELNUT_COFFEE, '헤이즐넛 파우더를 추가한 커피입니다.'],
]);


export class VendingMachineService {

    public static readonly findAllVendingMachine = async () => {
        return (await RestApiClient.get<{ allVmList: Array<VendingMachineDto>; }>('/vm/all')).data.allVmList;
    };

    public static readonly findVendingMachineById = async (vmId: number) => {
        return (await RestApiClient.post<{ vendingMachine: VendingMachine; }>(`/vm/${vmId}`)).data.vendingMachine;
    };

    public static readonly orderBeverage = async (input: OrderBeverageInput) => {
        const result = await RestApiClient.put<OrderBeverageResp>("/order", { input });
        if (result.status === 500) {
            console.log("error result", result);
            alert(`${result.data}`);
            throw new Error(JSON.stringify(result.data));
        }
        return result.data;
    };

    public static readonly checkOrderAvailable = async (orderList: Array<CheckOrderResourceInput>) => {
        const result = await RestApiClient.post<{ isAvailable: boolean; }>('/order/check', { orderList });
        return result.data.isAvailable;
    };

    public static readonly saleBeverageList = async (orderList: Array<OrderBeverageListInput>, paymentType: PAYMENT_TYPE, userPayment: number) => {
        const result = await RestApiClient.post<{ orderResult: OrderBeverageResp; }>("/order", { orderList, paymentType, userPayment });
        if (result.status === 500) {
            console.log("error result", result);
            alert(`${result.data}`);
            throw new Error(JSON.stringify(result.data));
        }
        console.log("data", result.data.orderResult);
        return result.data.orderResult;
    };
}