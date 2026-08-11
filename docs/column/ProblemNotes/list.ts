import { transformMenuList } from "../../utils/functions";
import { problemData } from "./data/problem";

// 踩坑记录转换
export const transformProblemData = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(problemData, path, isFilterList);
};

export const transformProblemList = (path: string, isFilterList: boolean = false, type?: string) => {
  if (type === "踩坑记录") {
    return transformProblemData(path, isFilterList);
  }
  return transformMenuList(problemData, path, isFilterList);
};
