import { transformMenuList } from "../../utils/functions";
import { problemData } from "./data/problem";
import { noteData } from "./data/note";

// 踩坑记录转换
export const transformProblemData = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(problemData, path, isFilterList);
};

// 日常笔记转换
export const transformNoteData = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(noteData, path, isFilterList);
};

/**
 * @deprecated 建议使用 transformProblemData 或 transformNoteData
 */
export const transformProblemList = (path: string, isFilterList: boolean = false, type?: string) => {
  if (type === "踩坑记录") {
    return transformProblemData(path, isFilterList);
  }
  if (type === "日常笔记") {
    return transformNoteData(path, isFilterList);
  }
  return transformMenuList([...problemData, ...noteData], path, isFilterList);
};
