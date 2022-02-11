import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import Home from './pages/Home';
import Cart from './pages/Cart';

import Payment from './pages/Cart/components/Payment';
import CartItemsList from './pages/Cart/components/CartItemsList';
import Confirmation from './pages/Cart/components/Confirmation';

import AppProvider from './providers/AppProvider';

import GlobalStyle from './styles/global';
import { AppContainer } from './styles/styles';

function App() {
  console.info(`==> 🌎  Você está no modo ${process.env.NODE_ENV}`);
  console.info(`==> 🌎  Você está no ambiente ${process.env.REACT_APP_ENVIRONMENT}`);

  return (
    <AppContainer>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart/*" element={<Cart />}>
              <Route path="*" element={<CartItemsList />} />
              <Route path="payment" element={<Payment />} />
              <Route path="confirmation" element={<Confirmation />} />
            </Route>
          </Routes>
        </BrowserRouter>

        <GlobalStyle />
      </AppProvider>
    </AppContainer>
  );
}

export default App;
