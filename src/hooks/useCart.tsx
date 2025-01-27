import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useRef,
  useEffect,
  SetStateAction,
  Dispatch
} from 'react';
import api from '../services/api';
import { Cart, CartItem } from '../interfaces/Cart';
import {
  BELEZA_NA_WEB_ALL_ITEMS,
  BELEZA_NA_WEB_CART_ITEMS,
  BELEZA_NA_WEB_CREDIT_CARD,
  BELEZA_NA_WEB_SUM_INFO
} from '../constants/local-storage';
import {
  cleanLocalStorage,
  getFromLocalStorage,
  setToLocalStorage
} from '../helpers/local-storage';
import { Focused } from 'react-credit-cards';
import { useToast } from './useToast';

import cartMapper from '../mappers/cart-mapper';

interface CartProviderProps {
  children: ReactNode;
}
interface UpdateItemQuantity {
  productSku: string;
  quantity: number;
}
interface CreditCardInfo {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  focused: Focused;
}
interface SumInfo {
  itemsSubTotal: number;
  itemsDiscount: number;
  itemsTotal: number;
  shippingTotal: number;
}
interface CartContextData {
  sumInfo: SumInfo;
  setSumInfo: Dispatch<SetStateAction<SumInfo>>;
  creditCardInfo: CreditCardInfo;
  setCreditCardInfo: Dispatch<SetStateAction<CreditCardInfo>>;
  cartItems: CartItem[];
  addProduct: (productSku: string) => Promise<void>;
  removeProduct: (productSku: string) => void;
  updateItemQuantity: ({ productSku, quantity }: UpdateItemQuantity) => void;
  stockquantity: number;
  isPurchaseConfirm: boolean;
  setIsPurchaseConfirm: Dispatch<SetStateAction<boolean>>;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const cartItemsFromLocalStorage = getFromLocalStorage(BELEZA_NA_WEB_CART_ITEMS);
  const sumInfoFromLocalStorage = getFromLocalStorage(BELEZA_NA_WEB_SUM_INFO);
  const creditCardFromStorage = getFromLocalStorage(BELEZA_NA_WEB_CREDIT_CARD);

  const [cartItems, setCartItems] = useState<CartItem[]>(cartItemsFromLocalStorage || []);
  const [sumInfo, setSumInfo] = useState<SumInfo>(sumInfoFromLocalStorage || {});
  const [creditCardInfo, setCreditCardInfo] = useState<CreditCardInfo>(creditCardFromStorage || {});
  const [isPurchaseConfirm, setIsPurchaseConfirm] = useState(false);

  const prevCartRef = useRef<CartItem[]>();
  const cartPreviousValue = prevCartRef.current ?? cartItems;
  const { addToast } = useToast();
  const stockquantity = 4;

  useEffect(() => {
    prevCartRef.current = cartItems;
  });

  useEffect(() => {
    if (cartPreviousValue !== cartItems) {
      setToLocalStorage(BELEZA_NA_WEB_CART_ITEMS, cartItems);
    }
  }, [cartPreviousValue, cartItems]);

  const addProduct = async (productSku: string) => {
    try {
      const updatedCartItems = [...cartItems];

      const itemAlreadyInCart = updatedCartItems.find((item) => item.product.sku === productSku);
      const quantitySum = itemAlreadyInCart ? itemAlreadyInCart.quantity : 0;
      const currentItemQuantity = quantitySum + 1;

      // se for chegar no limite do estoque
      if (currentItemQuantity > stockquantity) {
        addToast({
          type: 'error',
          title: 'Erro',
          description: 'Quantidade solicitada fora de estoque'
        });

        return;
      }

      // soma mais 1 no item que já está no carrinho
      if (itemAlreadyInCart) {
        itemAlreadyInCart.quantity = quantitySum + 1;
      }

      // armazena novo produto no carrinho
      else {
        const response = await api.get<Cart>('5b15c4923100004a006f3c07');
        const newItem = response.data.items.find(
          (item: CartItem) => item.product.sku === productSku
        );
        if (newItem) updatedCartItems.push(newItem);

        addToast({
          type: 'success',
          title: 'Sucesso!',
          description: `"${newItem?.product?.name}" foi adicionado ao carrinho`
        });
      }

      setCartItems(updatedCartItems);
      setSumInfoItems(updatedCartItems);
    } catch {
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Erro ao tentar incluir item no carrinho'
      });
    }
  };

  const updateItemQuantity = ({ productSku, quantity }: UpdateItemQuantity) => {
    try {
      if (quantity <= 0) return;

      if (quantity > stockquantity) {
        addToast({
          type: 'error',
          title: 'Erro',
          description: 'Quantidade solicitada fora de estoque'
        });
        return;
      }

      const updatedCartItems = [...cartItems];
      const itemAlreadyInCart = updatedCartItems.find((item) => item.product.sku === productSku);

      if (itemAlreadyInCart) {
        itemAlreadyInCart.quantity = quantity;

        setCartItems(updatedCartItems);
        setSumInfoItems(updatedCartItems);
      } else throw Error();
    } catch {
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Erro ao alterar quantidade'
      });
    }
  };

  const removeProduct = (productSku: string) => {
    try {
      const updatedCartItems = [...cartItems];
      const productIndex = updatedCartItems.findIndex((item) => item.product.sku === productSku);

      if (productIndex >= 0) {
        updatedCartItems.splice(productIndex, 1);
        setCartItems(updatedCartItems);
        setSumInfoItems(updatedCartItems);

        if (updatedCartItems?.length === 0) cleanLocalStorage();
      }
      //
      else throw Error();
    } catch {
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Erro na remoção de item'
      });
    }
  };

  const setSumInfoItems = (updatedCartItems: CartItem[]) => {
    const cartWithSubtotal = updatedCartItems.map((item) => ({
      ...item,
      subTotal: item.product.priceSpecification.price * item.quantity,
      discount: item.product.priceSpecification.discount
    }));

    let itemsSubTotal = 0;
    let itemsDiscount = 0;

    cartWithSubtotal.forEach((item) => {
      itemsDiscount += item.discount;
      itemsSubTotal += item.subTotal;
    });

    const itemsTotal = itemsSubTotal - itemsDiscount;

    const sumInfoObject = {
      ...sumInfo,
      itemsSubTotal,
      itemsDiscount,
      itemsTotal
    };

    setSumInfo(sumInfoObject);
    setToLocalStorage(BELEZA_NA_WEB_SUM_INFO, sumInfoObject);
  };

  return (
    <CartContext.Provider
      value={{
        sumInfo,
        setSumInfo,
        creditCardInfo,
        setCreditCardInfo,
        cartItems,
        addProduct,
        removeProduct,
        updateItemQuantity,
        stockquantity,
        isPurchaseConfirm,
        setIsPurchaseConfirm
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);
  return context;
}
