import { QueryRequestType } from "../../../../backend/types/queryReqeust";
import { EnergyType} from "../../../../backend/types/energy";
import { TableDataResponse} from "../../../../backend/types/CommonDataResponse";
import { PaginationState } from "@tanstack/react-table";
import { AvgProps } from "./components/card-section";


const origin =
  typeof window !== "undefined"
    ? window.location.origin.replace("5000", "3000")
    : "";

interface RequestDate{
  startDate: Date | undefined,
  endDate: Date | undefined
}

export interface RequestProps {
  date: RequestDate,
  pagination?: PaginationState | null 
}

export const getEnergy = async (props: RequestProps): Promise<TableDataResponse<EnergyType>> => {
  try {
    console.log("Port", origin)

    let filterConditions = [];
    let filterString = "";
    if (props.date.startDate != null && props.date.endDate != null) {
      filterConditions.push(
        `startDate=${props.date.startDate.toISOString()}&endDate=${props.date.endDate.toISOString()}`
      );
    }
    if (props.pagination?.pageIndex != null && props.pagination?.pageSize != null) {
      filterConditions.push(`offset=${props.pagination.pageIndex}&limit=${props.pagination.pageSize}`);
    }
    if (filterConditions.length > 0)
      filterString = `?${filterConditions.join("&")}`;

    const response = await fetch(`${origin}/energy${filterString}`);
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const getEnergySummary = async (props: RequestProps): Promise<AvgProps> => {
  try {
    let filterConditions = [];
    let filterString = "";
    if (props.date.startDate != null && props.date.endDate != null) {
      filterConditions.push(
        `startDate=${props.date.startDate.toISOString()}&endDate=${props.date.endDate.toISOString()}`
      );
    }

    if (filterConditions.length > 0)
      filterString = `?${filterConditions.join("&")}`;

    const response = await fetch(`${origin}/energy/summary${filterString}`);
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};
