import type {ActorMethod} from '@dfinity/agent';
import type {IDL} from '@dfinity/candid';
import type {Principal} from '@dfinity/principal';

export interface Account {
  owner: Principal;
  subaccount: [] | [Uint8Array | number[]];
}
export interface AssetEncodingNoContent {
  modified: bigint;
  sha256: Uint8Array | number[];
  total_length: bigint;
}
export interface AssetKey {
  token: [] | [string];
  collection: string;
  owner: Principal;
  name: string;
  description: [] | [string];
  full_path: string;
}
export interface AssetNoContent {
  key: AssetKey;
  updated_at: bigint;
  encodings: Array<[string, AssetEncodingNoContent]>;
  headers: Array<[string, string]>;
  created_at: bigint;
  version: [] | [bigint];
}
export interface AssetsUpgradeOptions {
  clear_existing_assets: [] | [boolean];
}
export interface CommitBatch {
  batch_id: bigint;
  headers: Array<[string, string]>;
  chunk_ids: Array<bigint>;
}
export interface CommitProposal {
  sha256: Uint8Array | number[];
  proposal_id: bigint;
}
export interface Config {
  monitoring: [] | [MonitoringConfig];
}
export interface ConfigMaxMemorySize {
  stable: [] | [bigint];
  heap: [] | [bigint];
}
export interface Controller {
  updated_at: bigint;
  metadata: Array<[string, string]>;
  created_at: bigint;
  scope: ControllerScope;
  expires_at: [] | [bigint];
}
export type ControllerScope = {Write: null} | {Admin: null};
export interface CreateCanisterConfig {
  subnet_id: [] | [Principal];
  name: [] | [string];
}
export interface CustomDomain {
  updated_at: bigint;
  created_at: bigint;
  version: [] | [bigint];
  bn_id: [] | [string];
}
export interface CyclesBalance {
  timestamp: bigint;
  amount: bigint;
}
export interface CyclesMonitoring {
  strategy: [] | [CyclesMonitoringStrategy];
  enabled: boolean;
}
export interface CyclesMonitoringConfig {
  notification: [] | [DepositedCyclesEmailNotification];
  default_strategy: [] | [CyclesMonitoringStrategy];
}
export interface CyclesMonitoringStartConfig {
  orbiters_strategy: [] | [SegmentsMonitoringStrategy];
  mission_control_strategy: [] | [CyclesMonitoringStrategy];
  satellites_strategy: [] | [SegmentsMonitoringStrategy];
}
export interface CyclesMonitoringStatus {
  monitored_ids: Array<Principal>;
  running: boolean;
}
export interface CyclesMonitoringStopConfig {
  satellite_ids: [] | [Array<Principal>];
  try_mission_control: [] | [boolean];
  orbiter_ids: [] | [Array<Principal>];
}
export type CyclesMonitoringStrategy = {BelowThreshold: CyclesThreshold};
export interface CyclesThreshold {
  fund_cycles: bigint;
  min_cycles: bigint;
}
export interface DeleteProposalAssets {
  proposal_ids: Array<bigint>;
}
export interface DepositCyclesArgs {
  cycles: bigint;
  destination_id: Principal;
}
export interface DepositedCyclesEmailNotification {
  to: [] | [string];
  enabled: boolean;
}
export type FundingErrorCode =
  | {BalanceCheckFailed: null}
  | {ObtainCyclesFailed: null}
  | {DepositFailed: null}
  | {InsufficientCycles: null}
  | {Other: string};
export interface FundingFailure {
  timestamp: bigint;
  error_code: FundingErrorCode;
}
export interface GetMonitoringHistory {
  to: [] | [bigint];
  from: [] | [bigint];
  segment_id: Principal;
}
export interface HttpRequest {
  url: string;
  method: string;
  body: Uint8Array | number[];
  headers: Array<[string, string]>;
  certificate_version: [] | [number];
}
export interface HttpResponse {
  body: Uint8Array | number[];
  headers: Array<[string, string]>;
  streaming_strategy: [] | [StreamingStrategy];
  status_code: number;
}
export interface InitAssetKey {
  token: [] | [string];
  collection: string;
  name: string;
  description: [] | [string];
  encoding_type: [] | [string];
  full_path: string;
}
export interface InitUploadResult {
  batch_id: bigint;
}
export interface ListMatcher {
  key: [] | [string];
  updated_at: [] | [TimestampMatcher];
  description: [] | [string];
  created_at: [] | [TimestampMatcher];
}
export interface ListOrder {
  field: ListOrderField;
  desc: boolean;
}
export type ListOrderField = {UpdatedAt: null} | {Keys: null} | {CreatedAt: null};
export interface ListPaginate {
  start_after: [] | [string];
  limit: [] | [bigint];
}
export interface ListParams {
  order: [] | [ListOrder];
  owner: [] | [Principal];
  matcher: [] | [ListMatcher];
  paginate: [] | [ListPaginate];
}
export interface ListResults {
  matches_pages: [] | [bigint];
  matches_length: bigint;
  items_page: [] | [bigint];
  items: Array<[string, AssetNoContent]>;
  items_length: bigint;
}
export type Memory = {Heap: null} | {Stable: null};
export interface MissionControlSettings {
  updated_at: bigint;
  created_at: bigint;
  monitoring: [] | [Monitoring];
}
export interface Monitoring {
  cycles: [] | [CyclesMonitoring];
}
export interface MonitoringConfig {
  cycles: [] | [CyclesMonitoringConfig];
}
export interface MonitoringHistory {
  cycles: [] | [MonitoringHistoryCycles];
}
export interface MonitoringHistoryCycles {
  deposited_cycles: [] | [CyclesBalance];
  cycles: CyclesBalance;
  funding_failure: [] | [FundingFailure];
}
export interface MonitoringHistoryKey {
  segment_id: Principal;
  created_at: bigint;
  nonce: number;
}
export interface MonitoringStartConfig {
  cycles_config: [] | [CyclesMonitoringStartConfig];
}
export interface MonitoringStatus {
  cycles: [] | [CyclesMonitoringStatus];
}
export interface MonitoringStopConfig {
  cycles_config: [] | [CyclesMonitoringStopConfig];
}
export interface Orbiter {
  updated_at: bigint;
  orbiter_id: Principal;
  metadata: Array<[string, string]>;
  created_at: bigint;
  settings: [] | [Settings];
}
export interface Proposal {
  status: ProposalStatus;
  updated_at: bigint;
  sha256: [] | [Uint8Array | number[]];
  executed_at: [] | [bigint];
  owner: Principal;
  created_at: bigint;
  version: [] | [bigint];
  proposal_type: ProposalType;
}
export type ProposalStatus =
  | {Initialized: null}
  | {Failed: null}
  | {Open: null}
  | {Rejected: null}
  | {Executed: null}
  | {Accepted: null};
export type ProposalType =
  | {AssetsUpgrade: AssetsUpgradeOptions}
  | {SegmentsDeployment: SegmentsDeploymentOptions};
export type Result = {Ok: bigint} | {Err: TransferError};
export type Result_1 = {Ok: bigint} | {Err: TransferError_1};
export interface Satellite {
  updated_at: bigint;
  metadata: Array<[string, string]>;
  created_at: bigint;
  satellite_id: Principal;
  settings: [] | [Settings];
}
export interface SegmentsDeploymentOptions {
  orbiter: [] | [string];
  mission_control_version: [] | [string];
  satellite_version: [] | [string];
}
export interface SegmentsMonitoringStrategy {
  ids: Array<Principal>;
  strategy: CyclesMonitoringStrategy;
}
export interface SetController {
  metadata: Array<[string, string]>;
  scope: ControllerScope;
  expires_at: [] | [bigint];
}
export interface Settings {
  monitoring: [] | [Monitoring];
}
export interface StorageConfig {
  iframe: [] | [StorageConfigIFrame];
  rewrites: Array<[string, string]>;
  headers: Array<[string, Array<[string, string]>]>;
  max_memory_size: [] | [ConfigMaxMemorySize];
  raw_access: [] | [StorageConfigRawAccess];
  redirects: [] | [Array<[string, StorageConfigRedirect]>];
}
export type StorageConfigIFrame = {Deny: null} | {AllowAny: null} | {SameOrigin: null};
export type StorageConfigRawAccess = {Deny: null} | {Allow: null};
export interface StorageConfigRedirect {
  status_code: number;
  location: string;
}
export interface StreamingCallbackHttpResponse {
  token: [] | [StreamingCallbackToken];
  body: Uint8Array | number[];
}
export interface StreamingCallbackToken {
  memory: Memory;
  token: [] | [string];
  sha256: [] | [Uint8Array | number[]];
  headers: Array<[string, string]>;
  index: bigint;
  encoding_type: string;
  full_path: string;
}
export type StreamingStrategy = {
  Callback: {
    token: StreamingCallbackToken;
    callback: [Principal, string];
  };
};
export interface Timestamp {
  timestamp_nanos: bigint;
}
export type TimestampMatcher =
  | {Equal: bigint}
  | {Between: [bigint, bigint]}
  | {GreaterThan: bigint}
  | {LessThan: bigint};
export interface Tokens {
  e8s: bigint;
}
export interface TransferArg {
  to: Account;
  fee: [] | [bigint];
  memo: [] | [Uint8Array | number[]];
  from_subaccount: [] | [Uint8Array | number[]];
  created_at_time: [] | [bigint];
  amount: bigint;
}
export interface TransferArgs {
  to: Uint8Array | number[];
  fee: Tokens;
  memo: bigint;
  from_subaccount: [] | [Uint8Array | number[]];
  created_at_time: [] | [Timestamp];
  amount: Tokens;
}
export type TransferError =
  | {
      TxTooOld: {allowed_window_nanos: bigint};
    }
  | {BadFee: {expected_fee: Tokens}}
  | {TxDuplicate: {duplicate_of: bigint}}
  | {TxCreatedInFuture: null}
  | {InsufficientFunds: {balance: Tokens}};
export type TransferError_1 =
  | {
      GenericError: {message: string; error_code: bigint};
    }
  | {TemporarilyUnavailable: null}
  | {BadBurn: {min_burn_amount: bigint}}
  | {Duplicate: {duplicate_of: bigint}}
  | {BadFee: {expected_fee: bigint}}
  | {CreatedInFuture: {ledger_time: bigint}}
  | {TooOld: null}
  | {InsufficientFunds: {balance: bigint}};
export interface UploadChunk {
  content: Uint8Array | number[];
  batch_id: bigint;
  order_id: [] | [bigint];
}
export interface UploadChunkResult {
  chunk_id: bigint;
}
export interface User {
  updated_at: bigint;
  metadata: Array<[string, string]>;
  user: [] | [Principal];
  created_at: bigint;
  config: [] | [Config];
}
export interface _SERVICE {
  add_mission_control_controllers: ActorMethod<[Array<Principal>], undefined>;
  add_satellites_controllers: ActorMethod<[Array<Principal>, Array<Principal>], undefined>;
  commit_proposal: ActorMethod<[CommitProposal], null>;
  commit_proposal_asset_upload: ActorMethod<[CommitBatch], undefined>;
  create_orbiter: ActorMethod<[[] | [string]], Orbiter>;
  create_orbiter_with_config: ActorMethod<[CreateCanisterConfig], Orbiter>;
  create_satellite: ActorMethod<[string], Satellite>;
  create_satellite_with_config: ActorMethod<[CreateCanisterConfig], Satellite>;
  del_custom_domain: ActorMethod<[string], undefined>;
  del_mission_control_controllers: ActorMethod<[Array<Principal>], undefined>;
  del_orbiter: ActorMethod<[Principal, bigint], undefined>;
  del_orbiters_controllers: ActorMethod<[Array<Principal>, Array<Principal>], undefined>;
  del_satellite: ActorMethod<[Principal, bigint], undefined>;
  del_satellites_controllers: ActorMethod<[Array<Principal>, Array<Principal>], undefined>;
  delete_proposal_assets: ActorMethod<[DeleteProposalAssets], undefined>;
  deposit_cycles: ActorMethod<[DepositCyclesArgs], undefined>;
  get_config: ActorMethod<[], [] | [Config]>;
  get_metadata: ActorMethod<[], Array<[string, string]>>;
  get_monitoring_history: ActorMethod<
    [GetMonitoringHistory],
    Array<[MonitoringHistoryKey, MonitoringHistory]>
  >;
  get_monitoring_status: ActorMethod<[], MonitoringStatus>;
  get_proposal: ActorMethod<[bigint], [] | [Proposal]>;
  get_settings: ActorMethod<[], [] | [MissionControlSettings]>;
  get_storage_config: ActorMethod<[], StorageConfig>;
  get_user: ActorMethod<[], Principal>;
  get_user_data: ActorMethod<[], User>;
  http_request: ActorMethod<[HttpRequest], HttpResponse>;
  http_request_streaming_callback: ActorMethod<
    [StreamingCallbackToken],
    StreamingCallbackHttpResponse
  >;
  icp_transfer: ActorMethod<[TransferArgs], Result>;
  icrc_transfer: ActorMethod<[Principal, TransferArg], Result_1>;
  init_proposal: ActorMethod<[ProposalType], [bigint, Proposal]>;
  init_proposal_asset_upload: ActorMethod<[InitAssetKey, bigint], InitUploadResult>;
  list_assets: ActorMethod<[string, ListParams], ListResults>;
  list_custom_domains: ActorMethod<[], Array<[string, CustomDomain]>>;
  list_mission_control_controllers: ActorMethod<[], Array<[Principal, Controller]>>;
  list_orbiters: ActorMethod<[], Array<[Principal, Orbiter]>>;
  list_satellites: ActorMethod<[], Array<[Principal, Satellite]>>;
  remove_mission_control_controllers: ActorMethod<[Array<Principal>], undefined>;
  remove_satellites_controllers: ActorMethod<[Array<Principal>, Array<Principal>], undefined>;
  set_config: ActorMethod<[[] | [Config]], undefined>;
  set_custom_domain: ActorMethod<[string, [] | [string]], undefined>;
  set_metadata: ActorMethod<[Array<[string, string]>], undefined>;
  set_mission_control_controllers: ActorMethod<[Array<Principal>, SetController], undefined>;
  set_orbiter: ActorMethod<[Principal, [] | [string]], Orbiter>;
  set_orbiter_metadata: ActorMethod<[Principal, Array<[string, string]>], Orbiter>;
  set_orbiters_controllers: ActorMethod<
    [Array<Principal>, Array<Principal>, SetController],
    undefined
  >;
  set_satellite: ActorMethod<[Principal, [] | [string]], Satellite>;
  set_satellite_metadata: ActorMethod<[Principal, Array<[string, string]>], Satellite>;
  set_satellites_controllers: ActorMethod<
    [Array<Principal>, Array<Principal>, SetController],
    undefined
  >;
  set_storage_config: ActorMethod<[StorageConfig], undefined>;
  start_monitoring: ActorMethod<[], undefined>;
  stop_monitoring: ActorMethod<[], undefined>;
  submit_proposal: ActorMethod<[bigint], [bigint, Proposal]>;
  top_up: ActorMethod<[Principal, Tokens], undefined>;
  unset_orbiter: ActorMethod<[Principal], undefined>;
  unset_satellite: ActorMethod<[Principal], undefined>;
  update_and_start_monitoring: ActorMethod<[MonitoringStartConfig], undefined>;
  update_and_stop_monitoring: ActorMethod<[MonitoringStopConfig], undefined>;
  upload_proposal_asset_chunk: ActorMethod<[UploadChunk], UploadChunkResult>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: {IDL: typeof IDL}) => IDL.Type[];
