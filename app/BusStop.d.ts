interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
}

type BusStopSort = "bus" | "time";

interface LocalStorageFavStop {
  busstop: string;
}

interface BusArrivalResponseData {
  "odata.metadata": string;
  BusStopCode: string;
  Services: BusArrivalService[];
}

interface BusArrivalService {
  ServiceNo: string;
  Operator: string;
  NextBus: BusArrivalNextBus;
  NextBus2: BusArrivalNextBus;
  NextBus3: BusArrivalNextBus;
}

interface BusArrivalNextBus {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: string;
  Feature: string;
  Type: string;
}

interface BusArrivalError {
  err: any;
}
