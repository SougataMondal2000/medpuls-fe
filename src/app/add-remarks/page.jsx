import React from "react";
import MiscComponent from "../components/MiscComponent";
import MiscTable from "../components/MiscTable";

const page = () => {
  return (
    <div>
      <MiscComponent
        miscType={"remarks"}
        sampleFile={"/Remarks_Sample.xlsx"}
        miscName={"Remarks"}
      />
      <MiscTable type={"remarks"} miscName={"Remarks"} />
    </div>
  );
};

export default page;
