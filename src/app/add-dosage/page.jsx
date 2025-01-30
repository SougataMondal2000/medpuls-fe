import React from "react";
import MiscComponent from "../components/MiscComponent";
import MiscTable from "../components/MiscTable";

const page = () => {
  return (
    <div>
      <MiscComponent
        miscType={"dose"}
        sampleFile={"/Dosage_Sample.xlsx"}
        miscName={"Dosage"}
      />
      <MiscTable type={"dose"} miscName={"Dosage"} />
    </div>
  );
};

export default page;
