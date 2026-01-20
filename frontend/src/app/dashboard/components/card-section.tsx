"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { getEnergy, getEnergySummary } from "../api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { EnergyType } from "../../../../../backend/types/energy";
interface IAverageData {
  voltage: number;
  current: number;
  power: number;
}
interface ICard {
  title: string;
  description: string;
  name: string;
  numberInfo: string | undefined;
  unit: string;
}
export function CardInfo(props: ICard) {
  return (
    <Card className="w-full max-w-sm max-sm:flex max-sm:justify-center">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <p>
            <span className="text-2xl">{props.name}: </span>
            <span className="text-3xl font-bold">
              {props.numberInfo} {props.unit}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
function average<T>(items: T[], selector: (item: T) => number): number {
  if (items.length === 0) return 0;
  return items.reduce((sum, item) => sum + selector(item), 0) / items.length;
}
interface CardSectionProps {
  dateRange: DateRange | undefined;
  setDateRage: (value: DateRange | undefined) => void;
}
export interface AvgProps {
  voltage: number;
  current: number;
  power: number;
}
export const CardSections = ({ dateRange, setDateRage }: CardSectionProps) => {
  const result = useQuery({
    queryKey: ["date", dateRange?.from, dateRange?.to],
    queryFn: () =>
      getEnergySummary({
        date: {
          startDate: dateRange?.from,
          endDate: dateRange?.to,
        },
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <div className="mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Select Date</Button>
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(e) => setDateRage(e)}
              numberOfMonths={2}
              className="rounded-lg border shadow-sm w-full"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-3 max-sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center grow mb-8">
        <CardInfo
          title={"Voltage Consumption"}
          description={"ການນຳໃຊ້ແຮງດັນໄຟຟ້າ"}
          name={"Voltage"}
          numberInfo={result.data?.voltage.toFixed(2)}
          unit="V"
        ></CardInfo>
        <CardInfo
          title={"Current Consumption"}
          description={"ການນຳໃຊ້ກະແສໄຟຟ້າ"}
          name={"Amp"}
          numberInfo={result.data?.current.toFixed(2)}
          unit="A"
        ></CardInfo>
        <CardInfo
          title={"Power Consumption"}
          description={"ການນຳໃຊ້ກຳລັງໄຟຟ້າ"}
          name={"Voltage"}
          numberInfo={result.data?.power.toFixed(2)}
          unit="W"
        ></CardInfo>
        {/* <CardInfo
        title={"Voltage Consumption"}
        description={"ການນຳໃຊ້ແຮງດັນໄຟຟ້າ"}
        name={"Voltage"}
        numberInfo={12}
      ></CardInfo> */}
      </div>
    </>
  );
};

export const CardSectionsSSE = () => {
  const [avg, setAvg] = useState<AvgProps>();
  useEffect(() => {
    const origin = window.location.origin.replace("5000", "3000");
    const url = `${origin}/sse/energy`;
    console.log(url);
    const es = new EventSource(url);

    es.onmessage = (event) => {
      const result = JSON.parse(event.data);
      const data: AvgProps = {
        current: result.current,
        power: result.power,
        voltage: result.voltage,
      };
      setAvg(data);
      console.log("data: ", data);
    };
    es.onerror = () => {
      es.close();
    };

    return () => es.close();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 max-sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center grow mb-8">
        <CardInfo
          title={"Voltage Consumption"}
          description={"ການນຳໃຊ້ແຮງດັນໄຟຟ້າ"}
          name={"Voltage"}
          numberInfo={avg?.voltage.toFixed(2)}
          unit="V"
        ></CardInfo>
        <CardInfo
          title={"Current Consumption"}
          description={"ການນຳໃຊ້ກະແສໄຟຟ້າ"}
          name={"Amp"}
          numberInfo={avg?.current.toFixed(2)}
          unit="A"
        ></CardInfo>
        <CardInfo
          title={"Power Consumption"}
          description={"ການນຳໃຊ້ກຳລັງໄຟຟ້າ"}
          name={"Voltage"}
          numberInfo={avg?.power.toFixed(2)}
          unit="W"
        ></CardInfo>
        {/* <CardInfo
        title={"Voltage Consumption"}
        description={"ການນຳໃຊ້ແຮງດັນໄຟຟ້າ"}
        name={"Voltage"}
        numberInfo={12}
      ></CardInfo> */}
      </div>
    </>
  );
};
