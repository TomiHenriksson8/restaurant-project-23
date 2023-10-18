interface Restaurant {
    CompanyId: number;
    name: string;
    address: string;
    postalCode: string;
    city: string;
    phone: string;
    location: {
        type: string,
        coordinates: number[];
    };
    company: string;
    _id: string;
}

export type {Restaurant}
