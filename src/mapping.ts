import { Address, BigInt, ethereum, BigDecimal, log } from "@graphprotocol/graph-ts"
import {
  sOlympus,
} from "../generated/sOlympus/sOlympus"
import { OHMDAILP } from "../generated/sOlympus/OHMDAILP";
import { Balance } from "../generated/schema"

function dayFromTimestamp(timestamp: BigInt): string {
  let day_ts = timestamp.toI32() - (timestamp.toI32() % 86400)
  return day_ts.toString()
}

function getOHMUSDRate(): BigDecimal {
  let pair = OHMDAILP.bind(Address.fromString("0x34d7d7Aaf50AD4944B70B320aCB24C95fa2def7c"))

  let reserves = pair.getReserves()
  let reserve0 = reserves.value0.toBigDecimal()
  let reserve1 = reserves.value1.toBigDecimal()

  let ohmRate = reserve1.div(reserve0).div(BigDecimal.fromString('1e9'))
  log.debug("OHM rate {}", [ohmRate.toString()])

  return ohmRate
}

function toDecimal(
  value: BigInt,
  decimals: number = 9,
): BigDecimal {
  let precision = BigInt.fromI32(10)
    .pow(<u8>decimals)
    .toBigDecimal();

  return value.divDecimal(precision);
}

export function handleBlock(block: ethereum.Block): void {
  let dayTimestamp = dayFromTimestamp(block.timestamp);
  let balance = Balance.load(dayTimestamp);
  if (!balance) {
    balance = new Balance(dayTimestamp);
    let contract = sOlympus.bind(Address.fromString("0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F"));
    const sOHMBalanceCall = contract.try_balanceOf(Address.fromString("0xdAdB69F5061E9087f8C30594bC2567D8Bc927C2b"));
    if (!sOHMBalanceCall.reverted) {
      const sOHMBalance = toDecimal(sOHMBalanceCall.value);
      balance.sOHMBalance = sOHMBalance;
      let OHMPrice = getOHMUSDRate();
      balance.sOHMBalanceUSD = sOHMBalance.times(OHMPrice);
    } else {
      balance.sOHMBalance = BigDecimal.fromString("0");
      balance.sOHMBalanceUSD = BigDecimal.fromString("0");
    }
    balance.timestamp = block.timestamp;
    balance.save();
  }
  balance.save();
};

