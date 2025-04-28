import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { authority, amount } = await request.json();

    const response = await fetch('https://api.zarinpal.com/pg/v4/payment/verify.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount: amount * 10, // Convert to Rial
        authority: authority,
      }),
    });

    const data = await response.json();
    
    if (data.data.code === 100) {
      return NextResponse.json({ 
        success: true, 
        data: data.data,
        message: 'پرداخت با موفقیت انجام شد'
      });
    } else if (data.data.code === 101) {
      return NextResponse.json({ 
        success: true, 
        data: data.data,
        message: 'این تراکنش قبلاً با موفقیت پرداخت شده است'
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'پرداخت تایید نشد' 
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 