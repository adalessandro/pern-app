//mostly duplicated code, it cannot be shared from the backend
export interface RequestState {
    status: 'idle' | 'loading' | 'failed';
    message: string;
}

export enum jobStatus {
    Pending = 'Pending',
    Sent = 'Sent',
    Translated = 'Translated',
    Deployed = 'Deployed',
    Canceled = 'Canceled',
    SentDelayed = 'Sent - Delayed',
    Resent = 'Resent',
}

export enum jobPriorities {
    Low = 3,
    Normal = 2,
    High = 1,
}

export enum projectStatus {
    Preparing = 0,
    ForApproval = 1,
    InProgress = 2,
    ForDownload = 3,
    Completed = 4,
    PartialDownload = 5,
    InReview = 6,
    Reviewed = 7,
    InSignOff = 8,
    SignedOff = 9,
    ForVendorSelection = 10,
    Cancelled = 11,
    New = 12,
} 

export enum userRoles {
    Read = 'Read',
    Write = 'Write',
    Root = 'Root',
}


export const pureMTProjectOptions = [
    'GitHub HTML',
    'GUI NMT - JSON',
    'MindTouch KB',
    'NGSS Raw NMT',
    'Quote Only - LCA EN UI',
    'Raw NMT - LCA EN UI',
    'Raw NMT - LCA LOC UI',
];

export const mtProjectOptions = [
    'Pactera Tridion Sites Integration',
    'Pactera LCA DITA XML EN-UI MT with PE',
    'Pactera LCA DITA XML LOC-UI MT with PE',
    'Pactera NMT - Full PE TRs 2019',
    'Pactera NMT Lab on Demand',
    'Pactera NMT NetAppU ARise',
    'Pactera NMT PE GitHub',
    'Pactera NMT PE Marketing',
    'Pactera Video MTPE',
    'Welocalize Video MTPE',
    'NGSS NMT Review',
    'NGSS TM Update',
];
