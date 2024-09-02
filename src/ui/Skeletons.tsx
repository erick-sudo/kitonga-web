export const CaseListItemSkeleton = () => {
  return (
    <div className="flex justify-between p-4 bg-white shadow-sm rounded-sm">
      <div className="p-2 w-3/5 shimmer-gray-200 rounded"></div>

      <div className="flex w-1/5 gap-2">
        <div className="p-2 flex-grow shimmer-gray-200 rounded"></div>
        <div className="p-2 shimmer-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export const CaseListSkeleton = ({ size = 6 }: { size?: number }) => {
  return (
    <div className="grid gap-2">
      {new Array(size || 6).fill(0).map((_, idx) => (
        <CaseListItemSkeleton key={idx} />
      ))}
    </div>
  );
};

export const CaseDetailsSkeleton = () => {
  return (
    <div className="grid bg-white rounded shadow px-4 py-2">
      <div className="flex border-b py-1">
        <div className="w-4/12">
          <div className="p-2 w-2/5 shimmer-gray-200 rounded"></div>
        </div>
        <div className="p-2 w-5/12 shimmer-gray-200 rounded"></div>
      </div>
      <div className="flex border-b py-1">
        <div className="w-4/12">
          <div className="p-2 w-3/5 shimmer-gray-200 rounded"></div>
        </div>
        <div className="p-2 w-7/12 shimmer-gray-200 rounded"></div>
      </div>
      <div className="flex border-b py-1">
        <div className="w-4/12">
          <div className="p-2 w-4/5 shimmer-gray-200 rounded"></div>
        </div>
        <div className="p-2 w-4/12 shimmer-gray-200 rounded"></div>
      </div>
      <div className="flex border-b py-1">
        <div className="w-4/12">
          <div className="p-2 w-3/6 shimmer-gray-200 rounded"></div>
        </div>
        <div className="p-2 w-6/12 shimmer-gray-200 rounded"></div>
      </div>
      <div className="flex border-b py-1">
        <div className="w-4/12">
          <div className="p-2 w-4/6 shimmer-gray-200 rounded"></div>
        </div>
        <div className="p-2 w-5/12 shimmer-gray-200 rounded"></div>
      </div>
      <div className="flex py-1 border-b">
        <div className="w-4/12">
          <div className="p-2 w-2/6 shimmer-gray-200 rounded"></div>
        </div>
        <div className="p-2 w-2/12 shimmer-gray-200 rounded"></div>
      </div>

      <div className="flex justify-end py-1 gap-4">
        <div className="p-2 w-24 shimmer-gray-200 rounded"></div>
        <div className="p-2 w-24 shimmer-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export const ClientDetailsSkeleton = () => {
  return (
    <div className="grid bg-white rounded shadow px-4 py-2">
      <div className="flex border-b py-1">
        <div className="p-2 w-2/5 shimmer-gray-200 rounded"></div>
      </div>
      <div className="flex border-b py-1">
        <div className="w-4/12">
          <div className="p-2 w-3/5 shimmer-gray-200 rounded"></div>
        </div>
        <div className="p-2 w-7/12 shimmer-gray-200 rounded"></div>
      </div>
      <div className="flex border-b py-1">
        <div className="w-4/12">
          <div className="p-2 w-4/5 shimmer-gray-200 rounded"></div>
        </div>
        <div className="p-2 w-2/12 shimmer-gray-200 rounded"></div>
      </div>
      <div className="flex border-b py-1">
        <div className="w-4/12">
          <div className="p-2 w-3/6 shimmer-gray-200 rounded"></div>
        </div>
        <div className="p-2 w-3/12 shimmer-gray-200 rounded"></div>
      </div>
      <div className="flex border-b py-1">
        <div className="w-4/12">
          <div className="p-2 w-4/6 shimmer-gray-200 rounded"></div>
        </div>
        <div className="p-2 w-4/12 shimmer-gray-200 rounded"></div>
      </div>
      <div className="flex py-1">
        <div className="w-4/12">
          <div className="p-2 w-2/6 shimmer-gray-200 rounded"></div>
        </div>
        <div className="p-2 w-1/12 shimmer-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export function PaymentListItemSkeleton() {
  return (
    <div className="border-t grid grid-cols-6 px-4 py-1 bg-white">
      {new Array(5).fill(0).map((_, idx) => (
        <div className="flex" key={idx}>
          <div className="p-2 w-3/5 shimmer-gray-200 rounded"></div>
        </div>
      ))}
      <div className="flex justify-end gap-2" key="lst">
        <div className="p-2 w-6 shimmer-gray-200 rounded"></div>
        <div className="p-2 w-6 shimmer-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export function PaymentListSkeleton({ size = 6 }: { size?: number }) {
  return (
    <div className="grid bg-white rounded overflow-hidden shadow">
      <div className=" grid grid-cols-6 px-4 py-1 bg-white">
        {new Array(5).fill(0).map((_, idx) => (
          <div className="flex" key={idx}>
            <div className="p-2 w-3/5 shimmer-gray-200 rounded"></div>
          </div>
        ))}
      </div>
      {new Array(size).fill(0).map((_, idx) => (
        <PaymentListItemSkeleton key={idx} />
      ))}
    </div>
  );
}

export const ClientListItemSkeleton = () => {
  return (
    <div className="flex justify-between p-4 bg-white shadow-sm rounded-sm">
      <div className="p-2 w-3/5 shimmer-gray-200 rounded"></div>

      <div className="flex w-1/5 gap-2">
        <div className="p-2 flex-grow shimmer-gray-200 rounded"></div>
        <div className="p-2 shimmer-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export const ClientListSkeleton = ({ size = 6 }: { size?: number }) => {
  return (
    <div className="grid gap-2">
      {new Array(size || 6).fill(0).map((_, idx) => (
        <CaseListItemSkeleton key={idx} />
      ))}
    </div>
  );
};
