
import { getEnergy } from "./api";
import { QueryRequestType } from "../../../../backend/types/queryReqeust";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { EnergyTable } from "./components/table";
import { CardSections } from "./components/card-section";
import { Main } from "./components/main";




const dashboard =  () => {

  return (
    <div className="w-full">
        {/* <CardSections></CardSections> */}
      <div>
        {/* <EnergyTable></EnergyTable> */}
        <Main></Main>
      </div>
    </div>
  );
};

export default dashboard;
