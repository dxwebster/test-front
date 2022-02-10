import React, { useRef, useCallback, useState, useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

// import formatCurrency from '../../helpers/formatCurrency';
import getValidationError from '../../helpers/validations';
import Button from '../../components/Button';
import Input from '../../components/Input';
import SumInfo from '../../components/SumInfo';

import { Container, FormContent, FormGroup } from './styles';
import { StorageContext } from '../../contexts/StorageContext';

export default function Payment() {
  const formRef = useRef<FormHandles>(null);
  const { cartItems } = useContext(StorageContext);

  const validForm = async () => {
    try {
      const data = formRef?.current?.getData();

      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        cardNumber: Yup.string().required('Digite o número do cartão'),
        titularName: Yup.string().required('Digite o nome do titular'),
        validate: Yup.string().required('Digite a validade do cartão'),
        cardCode: Yup.string().required('Digite o código do cartão')
      });

      await schema.validate(data, { abortEarly: false });

      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationError(err);
        formRef.current?.setErrors(errors);
        return;
      }

      return false;
    }
  };

  const handleSubmit = useCallback(async (data: any) => {
    const formIsValid = await validForm();

    console.log(data);

    // if (formIsValid) {
    //   navigate(`../dashboard?username=${data.user}&page=1&size=4&type=all`, { replace: true });
    // }
  }, []);

  return (
    <Container>
      <h2>CARTÃO DE CRÉDTIO</h2>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <FormContent>
          <fieldset>
            <label htmlFor="cardNumber">Número do cartão:</label>
            <Input name="cardNumber" type="text" placeholder="" radius="all" />
          </fieldset>

          <fieldset>
            <label htmlFor="titularName">Nome do Titular:</label>
            <Input
              name="titularName"
              type="text"
              placeholder="Como no Cartão"
              inputHeight="6rem"
              radius="all"
            />
          </fieldset>

          <FormGroup>
            <fieldset>
              <label htmlFor="validate">Validade (mês/ano):</label>
              <Input name="validate" type="text" placeholder="" radius="all" />
            </fieldset>

            <fieldset>
              <label htmlFor="cardCode">CVV:</label>
              <Input name="cardCode" type="text" placeholder="" radius="all" />
            </fieldset>
          </FormGroup>
        </FormContent>

        {cartItems && <SumInfo cart={cartItems} />}

        <Button type="submit" title="Finalizar Pagamento" />
      </Form>
    </Container>
  );
}
