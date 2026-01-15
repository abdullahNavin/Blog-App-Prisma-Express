type Iopotions = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};



const paginationSortingHelper = (options: Iopotions) => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 5;
  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder || "asc";
  const skip: number = (page - 1) * limit;

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    skip
  };
};

export default paginationSortingHelper;
