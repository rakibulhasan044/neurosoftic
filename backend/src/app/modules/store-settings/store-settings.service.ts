import { prisma } from "../../lib/prisma";

export const StoreSettingsService = {
  getStoreSettings: async () => {
    // 1. Get identity setting
    let companyNameSetting = await prisma.setting.findUnique({ where: { key: "COMPANY_NAME" } });
    
    // 2. Get theme config (base + extended)
    let themeConfig = await prisma.themeConfig.findFirst();
    let themeExtendedSetting = await prisma.setting.findUnique({ where: { key: "THEME_EXTENDED" } });
    
    // 3. Get generic settings
    let businessProfileSetting = await prisma.setting.findUnique({ where: { key: "BUSINESS_PROFILE" } });
    let localizationSetting = await prisma.setting.findUnique({ where: { key: "LOCALIZATION" } });
    let seoConfigSetting = await prisma.setting.findUnique({ where: { key: "SEO_CONFIG" } });
    let legalPoliciesSetting = await prisma.setting.findUnique({ where: { key: "LEGAL_POLICIES" } });
    let homeLayoutSetting = await prisma.setting.findUnique({ where: { key: "HOME_LAYOUT" } });
    let aboutPageSetting = await prisma.setting.findUnique({ where: { key: "ABOUT_PAGE" } });
    let faqSetting = await prisma.setting.findUnique({ where: { key: "FAQ_CONFIG" } });

    // 4. Get Navigation Menus and Banners
    const menus = await prisma.menu.findMany({ where: { isActive: true } });
    const banners = await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });

    return {
      identity: {
        companyName: companyNameSetting?.value ? (companyNameSetting.value as string) : "Neurosoftic",
      },
      theme: {
        ...(themeConfig || {
          primaryColor: "221.2 83.2% 53.3%",
          secondaryColor: "210 40% 96.1%",
          fontFamily: "Inter",
          logoUrl: null,
          faviconUrl: null,
        }),
        ...(themeExtendedSetting?.value as object || {
          accentColor: "262.1 83.3% 57.8%",
          backgroundColor: "0 0% 100%",
          textColor: "222.2 84% 4.9%",
          headingScale: "1.0",
          buttonRadius: "0.5rem",
          appIconUrl: null,
          socialPreviewImage: null
        })
      },
      businessProfile: businessProfileSetting?.value || {},
      localization: localizationSetting?.value || {},
      seo: seoConfigSetting?.value || {},
      legal: legalPoliciesSetting?.value || {},
      homeLayout: homeLayoutSetting?.value || {},
      about: aboutPageSetting?.value || {
        title: "About Neurosoftic",
        story: "We started with a vision to build the future...",
        mission: "To deliver premium tech to everyone.",
        vision: "A world connected by innovation.",
        heroImage: null
      },
      faq: faqSetting?.value || [],
      navigation: menus,
      banners: banners,
    };
  },

  updateStoreSettings: async (payload: any) => {
    const { identity, theme, businessProfile, localization, seo, legal, homeLayout, about, faq, navigation, banners } = payload;
    
    // 1. Update Identity
    if (identity && identity.companyName) {
      await prisma.setting.upsert({
        where: { key: "COMPANY_NAME" },
        update: { value: identity.companyName },
        create: { key: "COMPANY_NAME", value: identity.companyName }
      });
    }

    // 2. Update Theme
    if (theme) {
      const existingTheme = await prisma.themeConfig.findFirst();
      if (existingTheme) {
        await prisma.themeConfig.update({
          where: { id: existingTheme.id },
          data: {
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            fontFamily: theme.fontFamily,
            logoUrl: theme.logoUrl,
            faviconUrl: theme.faviconUrl,
          }
        });
      } else {
        await prisma.themeConfig.create({
          data: {
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            fontFamily: theme.fontFamily,
            logoUrl: theme.logoUrl,
            faviconUrl: theme.faviconUrl,
          }
        });
      }

      // Save the extended theme properties (radius, accent, etc) in generic setting
      const { primaryColor, secondaryColor, fontFamily, logoUrl, faviconUrl, id, ...extendedTheme } = theme;
      if (Object.keys(extendedTheme).length > 0) {
        await prisma.setting.upsert({
          where: { key: "THEME_EXTENDED" },
          update: { value: extendedTheme },
          create: { key: "THEME_EXTENDED", value: extendedTheme }
        });
      }
    }

    // 3. Update Generic JSON Settings
    const settingUpdates = [
      { key: "BUSINESS_PROFILE", value: businessProfile },
      { key: "LOCALIZATION", value: localization },
      { key: "SEO_CONFIG", value: seo },
      { key: "LEGAL_POLICIES", value: legal },
    ];

    for (const item of settingUpdates) {
      if (item.value) {
        await prisma.setting.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: { key: item.key, value: item.value }
        });
      }
    }

    if (homeLayout) {
      await prisma.setting.upsert({
        where: { key: "HOME_LAYOUT" },
        update: { value: homeLayout },
        create: { key: "HOME_LAYOUT", value: homeLayout }
      });
    }

    if (about) {
      await prisma.setting.upsert({
        where: { key: "ABOUT_PAGE" },
        update: { value: about },
        create: { key: "ABOUT_PAGE", value: about }
      });
    }

    if (faq) {
      await prisma.setting.upsert({
        where: { key: "FAQ_CONFIG" },
        update: { value: faq },
        create: { key: "FAQ_CONFIG", value: faq }
      });
    }

    // 4. Update Navigation
    if (navigation && Array.isArray(navigation)) {
      for (const nav of navigation) {
        if (nav.id) {
          await prisma.menu.update({
            where: { id: nav.id },
            data: {
              name: nav.name,
              position: nav.position,
              items: nav.items,
              isActive: nav.isActive,
            }
          });
        } else {
          await prisma.menu.create({
            data: {
              name: nav.name,
              position: nav.position,
              items: nav.items,
              isActive: nav.isActive ?? true,
            }
          });
        }
      }
    }

    // 5. Update Banners
    if (banners && Array.isArray(banners)) {
      const incomingIds = banners.filter((b: any) => b.id).map((b: any) => b.id);
      await prisma.banner.deleteMany({
        where: { id: { notIn: incomingIds } }
      });

      for (const b of banners) {
        if (b.id) {
          await prisma.banner.update({
            where: { id: b.id },
            data: {
              title: b.title,
              imageUrl: b.imageUrl,
              linkUrl: b.linkUrl || "",
              position: b.position || "HERO",
              sortOrder: b.sortOrder || 0,
              isActive: b.isActive ?? true
            }
          });
        } else {
          await prisma.banner.create({
            data: {
              title: b.title,
              imageUrl: b.imageUrl,
              linkUrl: b.linkUrl || "",
              position: b.position || "HERO",
              sortOrder: b.sortOrder || 0,
              isActive: b.isActive ?? true
            }
          });
        }
      }
    }

    return await StoreSettingsService.getStoreSettings();
  }
};
