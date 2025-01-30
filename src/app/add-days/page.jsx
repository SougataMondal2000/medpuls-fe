import React from "react";
import MiscComponent from "../components/MiscComponent";
import MiscTable from "../components/MiscTable";

const page = () => {
  return (
    <div>
      <MiscComponent
        miscType={"day"}
        sampleFile={"/Days_Sample.xlsx"}
        miscName={"Days"}
      />
      <MiscTable type={"day"} miscName={"Days"} />
    </div>
  );
};

export default page;
