export const renderLlmsTxt = (siteName: string, sections: string[]): string => {
  return [`# ${siteName}`, ...sections].join('\n\n')
}
