import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { amount, description, mobile } = await request.json();

    const response = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount: amount * 10, // Convert to Rial
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
        description: description,
        metadata: {
          mobile: mobile,
        }
      }),
    });

    const data = await response.json();
    
    if (data.data.code === 100) {
      const authority = data.data.authority;
      return NextResponse.json({ 
        success: true, 
        paymentUrl: `https://www.zarinpal.com/pg/StartPay/${authority}`,
        authority
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: data.errors.message 
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 