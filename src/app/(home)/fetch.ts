export async function getOverviewData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    views: {
      value: 3456,
      growthRate: 0.43,
    },
    profit: {
      value: 4220,
      growthRate: 4.35,
    },
    products: {
      value: 3456,
      growthRate: 2.59,
    },
    users: {
      value: 3456,
      growthRate: -0.95,
    },
  };
}

export async function getChatsData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      name: "JavaScript Fundamentals",
      profile: "/images/logo/logo.png", // replace with your actual asset
      category: "Programming",
      plays: 1254,
    },
    {
      name: "World History Quiz",
      profile: "/images/logo/logo.png",
      category: "History",
      plays: 1044,
    },
    {
      name: "Math Challenge",
      profile: "/images/logo/logo.png",
      category: "Mathematics",
      plays: 954,
    },
    {
      name: "Science Basics",
      profile: "/images/logo/logo.png",
      category: "Science",
      plays: 744,
    },
  ];
}
