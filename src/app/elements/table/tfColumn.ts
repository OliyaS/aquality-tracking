export class TFColumn {
    name: string;
    type: TFColumnType;
    property: string;
    sorting?= false;
    sorter?: TFSorting;
    headerlink?: string;
    filter?= false;
    lookup?: TFLookup;
    class?: string;
    editable?= false;
    notEditableByProperty?: string;
    link?: FTLink;
    title?: string;
    listeners?: string[];
    nullFilter?: boolean;
    bulkEdit?: boolean;
    format?: string;
    values?: string[];
    pattern?: string;
    creation?: TFCreation;
    dotsFilter?: TFDots;
}

export class FTLink {
    template: string;
    properties?: string[];
    params?: {};
}

export class TFSorting {
    order: TFOrder;
    property: string;
    weights?: { value: any, weight: number }[];
}

export class TFCreation {
    creationLength?: number;
    required: boolean;
}

export class TFLookup {
    values: any[];
    entity: string;
    objectWithId?: string;
    placeholder?: string;
    propToShow: string[];
    allowEmpty?= false;
}

export class TFDots {
    values: { name: string, only?: number[], contains?: number[] }[];
    propToShow: string[];
}

export enum TFOrder {
    desc = 'desc',
    asc = 'asc'
}

export enum TFColumnType {
    text = 'text',
    textarea = 'textarea',
    longtext = 'long-text',
    email = 'email',
    multiselect = 'multiselect',
    percent = 'percent',
    password = 'password',
    checkbox = 'checkbox',
    autocomplete = 'lookup-autocomplete',
    colored = 'lookup-colored',
    time = 'time',
    button = 'button',
    selector = 'selector',
    date = 'date',
    link = 'link',
    file = 'file',
    dots = 'dots'
}
