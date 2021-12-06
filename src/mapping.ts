import { BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { Balance } from "../generated/schema"
import { dayFromTimestamp, getOHMUSDRate, hourFromTimestamp, getSOhmBalance, getIndex } from "./utils";

export function handleBlock(block: ethereum.Block): void {
  const hourTimestamp = hourFromTimestamp(block.timestamp);
  const dayTimestamp = dayFromTimestamp(block.timestamp)
  let balance = Balance.load(dayTimestamp);

  if (!balance) {
    createNewBalance(block);
  } else if (hourFromTimestamp(block.timestamp) !== hourTimestamp) {
    updateBalance(balance, BigInt.fromString(hourTimestamp));
  }
};

//create new balance record every 24 hours
function createNewBalance(block: ethereum.Block): void {
  const dayTimestamp = dayFromTimestamp(block.timestamp);
  const hourTimestamp = hourFromTimestamp(block.timestamp);
  const balance = new Balance(dayTimestamp);

  const index = getIndex();
  const OHMPrice = getOHMUSDRate();

  balance.sOHMBalance = BigDecimal.fromString("0");
  balance.sOHMBalanceUSD = BigDecimal.fromString("0");
  balance.index = index;
  balance.ohmPrice = OHMPrice;
  balance.gOhmPrice = OHMPrice.times(index);
  balance.timestamp = block.timestamp;
  balance.hourTimestamp = BigInt.fromString(hourTimestamp);
  balance.save();
}

//update index and prices every hour
function updateBalance(balance: Balance, hourTimestamp: BigInt): void {
  const index = getIndex();
  const OHMPrice = getOHMUSDRate();

  balance.index = index;
  balance.ohmPrice = OHMPrice;
  balance.gOhmPrice = OHMPrice.times(index);
  balance.hourTimestamp = hourTimestamp;
  balance.save();
}


