import React from "react";
import MiscComponent from "../components/MiscComponent";
import MiscTable from "../components/MiscTable";

const page = () => {
  return (
    <div>
      <MiscComponent
        miscType={"test"}
        sampleFile={"/Test_Sample.xlsx"}
        miscName={"Tests"}
      />
      <MiscTable type={"test"} miscName={"Tests"} />
    </div>
  );
};

export default page;
