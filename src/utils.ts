import { BigInt, BigDecimal, Address, log } from "@graphprotocol/graph-ts";
import { OHMDAILP } from "../generated/sOlympus/OHMDAILP";
import { sOlympus } from "../generated/sOlympus/sOlympus";

export function dayFromTimestamp(timestamp: BigInt): string {
    let day_ts = timestamp.toI32() - (timestamp.toI32() % 86400)
    return day_ts.toString()
  }
  
  export function fiveMinutesFromTimestamp(timestamp: BigInt): string {
    let day_ts = timestamp.toI32() - (timestamp.toI32() % 300)
    return day_ts.toString()
  }
  
  export function getOHMUSDRate(): BigDecimal {
    let pair = OHMDAILP.bind(Address.fromString("0x34d7d7Aaf50AD4944B70B320aCB24C95fa2def7c"))
  
    let reserves = pair.getReserves()
    let reserve0 = reserves.value0.toBigDecimal()
    let reserve1 = reserves.value1.toBigDecimal()
  
    let ohmRate = reserve1.div(reserve0).div(BigDecimal.fromString('1e9'))
    log.debug("OHM rate {}", [ohmRate.toString()])
  
    return ohmRate
  }
  
  export function toDecimal(
    value: BigInt,
    decimals: number = 9,
  ): BigDecimal {
    let precision = BigInt.fromI32(10)
      .pow(<u8>decimals)
      .toBigDecimal();
  
    return value.divDecimal(precision);
  }

  export const sOlympusContract = sOlympus.bind(Address.fromString("0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F"));

  export function getSOhmBalance(address: string): BigDecimal {
    return toDecimal(sOlympusContract.balanceOf(Address.fromString(address)));
  }

  export function getIndex(): BigDecimal {
      return toDecimal(sOlympusContract.index())
  }
  