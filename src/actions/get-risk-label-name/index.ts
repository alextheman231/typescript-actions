import { getInput } from "@actions/core";
import { az } from "@alextheman/utility";
import z from "zod";

import getRiskLabelName, { RiskLevel } from "src/actions/get-risk-label-name/getRiskLabelName";
import getOptionalInput from "src/utility/getOptionalInput";

(async () => {
  await getRiskLabelName({
    riskLevel: az.with(z.enum(RiskLevel)).parse(getInput("risk-level").toLowerCase()),
    lowRiskLabelName: getOptionalInput("low-risk-label-name") ?? "low risk",
    mediumRiskLabelName: getOptionalInput("medium-risk-label-name") ?? "medium risk",
    highRiskLabelName: getOptionalInput("high-risk-label-name") ?? "high risk",
  });
})();
