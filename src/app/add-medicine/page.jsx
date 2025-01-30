import React from "react";
import MiscComponent from "../components/MiscComponent";
import MiscTable from "../components/MiscTable";

const page = () => {
  return (
    <div>
      <MiscComponent
        miscType={"drug"}
        sampleFile={"/Medicine_Sample.xlsx"}
        miscName={"Medicines"}
      />
      <MiscTable type={"drug"} miscName={"Medicines"} />
    </div>
  );
};

export default page;
