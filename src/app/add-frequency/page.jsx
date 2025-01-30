import React from "react";
import MiscComponent from "../components/MiscComponent";
import MiscTable from "../components/MiscTable";

const page = () => {
  return (
    <div>
      <MiscComponent
        miscType={"frequency"}
        sampleFile={"/Frequency_Sample.xlsx"}
        miscName={"Frequencies"}
      />
      <MiscTable type={"frequency"} miscName={"Frequencies"} />
    </div>
  );
};

export default page;
