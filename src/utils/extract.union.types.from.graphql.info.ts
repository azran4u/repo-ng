export function extractUnionTypesFromGraphqlInfo(
  info: any,
  first?: string
): string[] {
  const res: string[] = [];
  info?.fieldNodes[0].selectionSet?.selections?.forEach((selectionSet) => {
    if (first) {
      if (selectionSet.kind === "Field") {
        if (selectionSet.name.value === first) {
          res.push(selectionSet.loc.startToken.next.next.next.next.value);
        }
      }
    } else {
      if (selectionSet.kind === "InlineFragment")
        res.push(selectionSet.loc.startToken.next.next.value);
    }
  });
  return res;
}
