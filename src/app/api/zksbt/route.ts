import { NextResponse } from 'next/server';
import { ZKSbtSDK } from "@zksbt/jssdk";
import { ethers } from 'ethers';
import axios from 'axios';

const ZKSBT_CONTRACT = '0xa44155ffbcE68C9C848f8Ea6F28C40311085125E';
// const MANTA_RPC = 'https://pacific-rpc.sepolia-testnet.manta.network/http';
const MANTA_RPC = 'https://pacific-rpc.manta.network/http';

export async function POST(request: Request) {
  const { operation, address } = await request.json();
  
  const provider = new ethers.providers.JsonRpcProvider(MANTA_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const sdk = await ZKSbtSDK.create(wallet, ZKSBT_CONTRACT);

  const CATEGORY = BigInt('109n')       // MANTA PACIFIC ASSET CERTIFICATE
  const ATTRIBUTE = "1"
  const URL = "https://npo-cdn.asmatch.xyz/MantaPacific/ETH/ETH_moreThan1.jpg"
  const claim_signature = await sdk.claimSbtSignature(CATEGORY, ATTRIBUTE)
  const req = {
      "sig": claim_signature,
      "publicAddress": sdk.identity.getCommitment().toString(),
      "category": CATEGORY.toString(),
      "attribute": ATTRIBUTE,
      "url": URL,
      "email": ""
  }

  switch (operation) {
    case 'sign':
      try {
        const API = 'https://prod.asmatch-api-npo.asmatch.xyz/pomp/premint';
        const resp = await axios.post(API, req)
        return NextResponse.json({ success: true, resp: resp.data });
      } catch (error) {
        console.log(error);
        return NextResponse.json({ error });
      }
    case 'mint':
      const result = await sdk.mint(CATEGORY, ATTRIBUTE, address, BigInt(Date.now()), claim_signature);
      return NextResponse.json({ success: true, result });
    case 'verify':
      const isValid = await sdk.verify(CATEGORY, ATTRIBUTE);
      return NextResponse.json({ success: true, isValid });
    default:
      return NextResponse.json({ success: false, error: 'Invalid operation' });
  }
}
