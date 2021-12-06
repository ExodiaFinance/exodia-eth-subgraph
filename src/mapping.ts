import { Address, BigInt, ethereum, BigDecimal, log } from "@graphprotocol/graph-ts"
import {
  sOlympus,
} from "../generated/sOlympus/sOlympus"
import { Balance } from "../generated/schema"
import { dayFromTimestamp, toDecimal, getOHMUSDRate, hourFromTimestamp, sOlympusContract, getSOhmBalance, getIndex } from "./utils";

export function handleBlock(block: ethereum.Block): void {
  const hourTimestamp = BigInt.fromString(hourFromTimestamp(block.timestamp));
  const dayTimestamp = dayFromTimestamp(block.timestamp)
  let balance = Balance.load(dayTimestamp);

  if (!balance) {
    createNewBalance(block);
    return;
  }

  if (balance.hourTimestamp !== hourTimestamp) {
    updateBalance(balance, hourTimestamp);
    return;
  }
};

//create new balance record every 24 hours
function createNewBalance(block: ethereum.Block): void {
  const dayTimestamp = dayFromTimestamp(block.timestamp);
  const hourTimestamp = hourFromTimestamp(block.timestamp);
  const balance = new Balance(dayTimestamp);

  const sOHMBalance = getSOhmBalance("0xdAdB69F5061E9087f8C30594bC2567D8Bc927C2b");
  const index = getIndex();
  const OHMPrice = getOHMUSDRate();

  balance.sOHMBalance = sOHMBalance;
  balance.sOHMBalanceUSD = sOHMBalance.times(OHMPrice);
  balance.index = index;
  balance.ohmPrice = OHMPrice;
  balance.gOhmPrice = OHMPrice.times(index);
  balance.timestamp = block.timestamp;
  balance.hourTimestamp = BigInt.fromString(hourTimestamp);
  balance.save();
}

//update balance every hour
function updateBalance(balance: Balance, hourTimestamp: BigInt): void {
  const sOHMBalance = getSOhmBalance("0xdAdB69F5061E9087f8C30594bC2567D8Bc927C2b");
  const index = getIndex();
  const OHMPrice = getOHMUSDRate();

  balance.sOHMBalance = sOHMBalance;
  balance.sOHMBalanceUSD = sOHMBalance.times(OHMPrice);
  balance.index = index;
  balance.ohmPrice = OHMPrice;
  balance.gOhmPrice = OHMPrice.times(index);
  balance.hourTimestamp = hourTimestamp;
  balance.save();
}


