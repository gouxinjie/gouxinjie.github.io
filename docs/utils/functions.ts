const pattern = /[a-zA-Z0-9_\u0392-\u03C9\u00C0-\u00FF\u0600-\u06FF\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\uAC00-\uD7AF]+/g;

/**
 * @description 统计字符串中的中文和英文单词数量
 * @param data 字符串
 * @returns 数量
 */
export function countWord(data: string) {
  const m = data.match(pattern);
  let count = 0;
  if (!m) {
    return 0;
  }
  for (let i = 0; i < m.length; i += 1) {
    if (m[i].charCodeAt(0) >= 0x4e00) {
      count += m[i].length;
    } else {
      count += 1;
    }
  }
  return count;
}

// 定义 MenuItem 接口
export interface MenuItem {
  text: string;
  link?: string;
  items?: MenuItem[];
  collapsed?: boolean;
}

/**
 * @description 通用的菜单项转换函数，支持处理任意深度的嵌套结构
 * @param rawList 原始菜单项数组
 * @param path 路径前缀
 * @param isFilterList 是否用于筛选页面的处理
 * @param showIndex 是否在文本前显示索引
 * @returns 转换后的菜单项数组
 */
export function transformMenuList(rawList: MenuItem[], path: string, isFilterList: boolean = false, showIndex: boolean = false): MenuItem[] {
  // 使用深度优先遍历处理嵌套结构
  const transformItems = (items: MenuItem[], parentPath: string = "", level: number = 0): MenuItem[] => {
    return items.map((item, index) => {
      const currentPath = `${parentPath}${parentPath ? "/" : ""}${item.text}`;

      // 处理当前项
      const transformedItem: MenuItem = {
        ...item,
        text: isFilterList ? item.text : showIndex && level >= 1 ? `${index + 1}. ${item.text}` : `${item.text}`
      };

      // 如果是筛选页面，添加链接（只对叶子节点添加）
      if (isFilterList && !item.items?.length) {
        transformedItem.link = `${path}${currentPath}`;
      } else if (!isFilterList) {
        transformedItem.link = `${path}${currentPath}.md`;
      }

      // 递归处理子项
      if (item.items) {
        transformedItem.items = transformItems(item.items, currentPath, level + 1);
      }

      return transformedItem;
    });
  };

  return transformItems(rawList);
}
