import { ReactNode, useEffect, useState, useTransition } from "react";
import * as Ariakit from "@ariakit/react";

export function usePathTabs(
  tabs: string[],
  {
    follow,
  }: {
    follow: boolean;
  }
) {
  const [isPending, startTransition] = useTransition();
  const [selectedTab, setSelectedTab] = useState<string | null | undefined>(
    null
  );
  const [currentTab, setCurrentTab] = useState<string | null | undefined>(null);

  const selectTab = (nextTab: string | null | undefined) => {
    if (nextTab !== selectedTab) {
      setSelectedTab(nextTab);
      startTransition(() => {
        setCurrentTab(nextTab);
      });
    }
  };

  useEffect(() => {
    if (follow) {
      const lastTab = tabs.at(-1);
      if (lastTab !== selectedTab) {
        selectTab(lastTab);
      }
    }
  }, [tabs]);

  const tabStore = Ariakit.useTabStore({
    selectedId: selectedTab,
    setSelectedId: selectTab,
  });

  return {
    tabs,
    isPending,
    currentTab,
    tabStore,
  };
}

export function PathTabs({
  isPending,
  tabStore,
  tabs,
  currentTab,
  children,
}: ReturnType<typeof usePathTabs> & { children: ReactNode }) {
  return (
    <>
      <Ariakit.TabList
        store={tabStore}
        className="flex max-w-full flex-row gap-2 overflow-x-auto rounded-2xl !p-2 outline outline-2 outline-offset-2 outline-transparent transition-all duration-200 focus:outline-blue-400 md:flex-wrap md:pb-0"
      >
        {tabs.map((tab) => (
          <Ariakit.Tab className="group" key={tab} id={tab}>
            <div className="rounded-lg px-2 bg-slate-200 dark:bg-slate-800 dark:group-aria-selected:bg-blue-700 group-aria-selected:bg-blue-300 py-0.5 border-none text-left outline outline-2 outline-offset-2 outline-transparent transition-all duration-200 focus:outline-blue-400 ">
              <span className="text-slate-900 dark:text-white">
                {new URL(tab).pathname}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {new URL(tab).search}
              </span>
            </div>
          </Ariakit.Tab>
        ))}
      </Ariakit.TabList>

      <Ariakit.TabPanel
        store={tabStore}
        tabId={currentTab}
        alwaysVisible={true}
        className={`flex flex-col gap-4 transition-opacity duration-100 delay-[50] p-2 ${
          isPending ? "opacity-60" : ""
        }`}
        aria-label="Paths"
        aria-busy={isPending}
      >
        {children}
      </Ariakit.TabPanel>
    </>
  );
}
