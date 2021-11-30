import { BigInt } from "@graphprotocol/graph-ts"
import {
  sOlympus,
  Approval,
  LogRebase,
  LogStakingContractUpdated,
  LogSupply,
  OwnershipPulled,
  OwnershipPushed,
  Transfer
} from "../generated/sOlympus/sOlympus"
import { ExampleEntity } from "../generated/schema"

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.owner = event.params.owner
  entity.spender = event.params.spender

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.DOMAIN_SEPARATOR(...)
  // - contract.INDEX(...)
  // - contract.PERMIT_TYPEHASH(...)
  // - contract.allowance(...)
  // - contract.approve(...)
  // - contract.balanceForGons(...)
  // - contract.balanceOf(...)
  // - contract.circulatingSupply(...)
  // - contract.decimals(...)
  // - contract.decreaseAllowance(...)
  // - contract.gonsForBalance(...)
  // - contract.increaseAllowance(...)
  // - contract.index(...)
  // - contract.initialize(...)
  // - contract.initializer(...)
  // - contract.manager(...)
  // - contract.name(...)
  // - contract.nonces(...)
  // - contract.rebase(...)
  // - contract.rebases(...)
  // - contract.setIndex(...)
  // - contract.stakingContract(...)
  // - contract.symbol(...)
  // - contract.totalSupply(...)
  // - contract.transfer(...)
  // - contract.transferFrom(...)
}

export function handleLogRebase(event: LogRebase): void {}

export function handleLogStakingContractUpdated(
  event: LogStakingContractUpdated
): void {}

export function handleLogSupply(event: LogSupply): void {}

export function handleOwnershipPulled(event: OwnershipPulled): void {}

export function handleOwnershipPushed(event: OwnershipPushed): void {}

export function handleTransfer(event: Transfer): void {}
