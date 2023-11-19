"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreatePaymentMutation } from "@/redux/api/paymentApi";
import { getUserInfo } from "@/services/auth.service";
import { loadStripe } from "@stripe/stripe-js";

const stripeKey =
  "pk_test_51O7I6YSHcqDbqznpElzunzfMsBFHFu6tog3M1UGhXBb5DcqO15sSsbshWIewrqyLC7kOVmpb0aP2L2iFVwJ672ef00llYTcNGY";

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface PaymentResponse {
  clientSecret: string | null;
}

type ApiResponse<T> = {
  data?: T | null;
  error?: unknown;
};

function generateTransactionId() {
  const timestamp = new Date().getTime();
  const randomValue = Math.floor(Math.random() * 1000);
  return `txn_${timestamp}_${randomValue}`;
}

export default function PaymentForm({ product }: { product: Product }) {
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState({
    price: 0,
    name: "",
    transactionId: "",
  });

  // const router = useRouter();
  const [createPayment, { isSuccess, isError }] = useCreatePaymentMutation();

  const { role, name, email } = getUserInfo() as any;

  useEffect(() => {
    if (product) {
      setPaymentInfo({
        price: product.price,
        name: product.name,
        transactionId: generateTransactionId(),
      });
    }
  }, [product]);

  const onSubmit = async (product: any) => {
    const stripe = await loadStripe(stripeKey);
    try {
      const result: any = await createPayment(product);
      console.log(result, "result");

      const url = result?.data?.sessionUrl;
      console.log(url, "url");

      router.push(url);
    } catch (err: any) {
      console.log("err occurred when creating payment");
    }
  };

  return (
    <div>
      <button
        className="bg-purple-800 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded w-48 mt-16"
        onClick={() => onSubmit(product)}
      >
        Checkout
      </button>
    </div>
  );
}
