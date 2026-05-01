export type ConnectorType = "CCS2" | "CHAdeMO" | "Type2" | "J1772";
export type StationStatus = "available" | "occupied" | "offline";
export type SessionStatus =
  | "idle"
  | "awaiting_payment"
  | "tx_sent"
  | "confirmed"
  | "charging"
  | "finished"
  | "failed";
export type Asset = "USDC" | "BRZ";

export interface Station {
  id: string;
  name: string;
  location: string;
  power: string;
  powerKw: number;
  type: "AC" | "DC";
  status: StationStatus;
  pricePerKwh: number;
  currency: "BRL";
  connectors: ConnectorType[];
  address: string;
  lat: number;
  lng: number;
}

export interface ChargingSession {
  id: string;
  stationId: string;
  stationName: string;
  user: string;
  wallet: string;
  asset: Asset;
  amountPaid: number;
  kwh: number;
  platformFee: number;
  netOperator: number;
  status: SessionStatus;
  txHash: string;
  startedAt: string;
  finishedAt?: string;
  duration: number;
  connector: ConnectorType;
}

export const STATIONS: Station[] = [
  {
    id: "qv-001",
    name: "QuiloVolt Recife Shopping",
    location: "Recife, PE",
    power: "60 kW DC",
    powerKw: 60,
    type: "DC",
    status: "available",
    pricePerKwh: 2.8,
    currency: "BRL",
    connectors: ["CCS2", "CHAdeMO"],
    address: "Av. Agamenon Magalhães, 153 - Recife",
    lat: -8.062,
    lng: -34.873,
  },
  {
    id: "qv-002",
    name: "QuiloVolt Boa Viagem",
    location: "Recife, PE",
    power: "22 kW AC",
    powerKw: 22,
    type: "AC",
    status: "available",
    pricePerKwh: 2.2,
    currency: "BRL",
    connectors: ["Type2"],
    address: "Av. Boa Viagem, 3600 - Recife",
    lat: -8.119,
    lng: -34.9,
  },
  {
    id: "qv-003",
    name: "QuiloVolt Rodovia PE-060",
    location: "Ipojuca, PE",
    power: "60 kW DC",
    powerKw: 60,
    type: "DC",
    status: "occupied",
    pricePerKwh: 2.9,
    currency: "BRL",
    connectors: ["CCS2"],
    address: "BR Posto km 34, Rodovia PE-060",
    lat: -8.399,
    lng: -35.067,
  },
  {
    id: "qv-004",
    name: "QuiloVolt Academia Parceira",
    location: "Olinda, PE",
    power: "7 kW AC",
    powerKw: 7,
    type: "AC",
    status: "available",
    pricePerKwh: 1.9,
    currency: "BRL",
    connectors: ["Type2", "J1772"],
    address: "R. do Sol, 48 - Olinda",
    lat: -7.984,
    lng: -34.854,
  },
];

export const MOCK_USER = {
  name: "Lucas Monteiro",
  wallet: "GDXTEST7K3ELUVB2AQHB3W5NJPXM4E2FKAQB7CX9QRNDEMO2026TEST",
  walletShort: "GDX...TEST",
  asset: "USDC" as Asset,
};

export const PLATFORM_FEE_PCT = 0.03;

export const MOCK_SESSIONS: ChargingSession[] = [
  {
    id: "sess-0001",
    stationId: "qv-001",
    stationName: "QuiloVolt Recife Shopping",
    user: "Lucas Monteiro",
    wallet: "GDX...TEST",
    asset: "USDC",
    amountPaid: 28.0,
    kwh: 10.0,
    platformFee: 0.84,
    netOperator: 27.16,
    status: "finished",
    txHash: "stellar_testnet_tx_9f82a7c3b1e5d4f0a2c8b7e6d3f1a9c5",
    startedAt: "2026-05-01T09:14:00Z",
    finishedAt: "2026-05-01T09:38:00Z",
    duration: 1440,
    connector: "CCS2",
  },
  {
    id: "sess-0002",
    stationId: "qv-002",
    stationName: "QuiloVolt Boa Viagem",
    user: "Ana Souza",
    wallet: "GBZ...DEMO",
    asset: "BRZ",
    amountPaid: 19.8,
    kwh: 9.0,
    platformFee: 0.59,
    netOperator: 19.21,
    status: "finished",
    txHash: "stellar_testnet_tx_3d71f0e2a8c4b6d9e1f5a2b3c7d4e9f0",
    startedAt: "2026-05-01T10:05:00Z",
    finishedAt: "2026-05-01T10:54:00Z",
    duration: 2940,
    connector: "Type2",
  },
  {
    id: "sess-0003",
    stationId: "qv-004",
    stationName: "QuiloVolt Academia Parceira",
    user: "Carlos Ferreira",
    wallet: "GCF...DEMO",
    asset: "USDC",
    amountPaid: 15.2,
    kwh: 8.0,
    platformFee: 0.46,
    netOperator: 14.74,
    status: "charging",
    txHash: "stellar_testnet_tx_7ab2c5d8e3f1a4b6c9d2e5f8a1b3c4d7",
    startedAt: "2026-05-01T11:20:00Z",
    duration: 900,
    connector: "Type2",
  },
  {
    id: "sess-0004",
    stationId: "qv-003",
    stationName: "QuiloVolt Rodovia PE-060",
    user: "Fernanda Lima",
    wallet: "GFL...DEMO",
    asset: "BRZ",
    amountPaid: 34.8,
    kwh: 12.0,
    platformFee: 1.04,
    netOperator: 33.76,
    status: "charging",
    txHash: "stellar_testnet_tx_2bc4d6e8f0a1b3c5d7e9f2a4b6c8d0e2",
    startedAt: "2026-05-01T11:05:00Z",
    duration: 1500,
    connector: "CCS2",
  },
];
