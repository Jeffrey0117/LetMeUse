import type { CompareCopy, CompareRow } from './compare-copy'

interface CompareSectionProps {
  copy: CompareCopy
  containerClass: string
  titleClass: string
}

function rowTone(row: CompareRow): string {
  return row.ours ? 'bg-zinc-900 text-white' : 'text-zinc-700'
}

/** Table on wide screens, one card per product on phones — no sideways scrolling. */
export function CompareSection({ copy, containerClass, titleClass }: CompareSectionProps) {
  return (
    <section id="compare" className={`${containerClass} scroll-mt-16 py-14`}>
      <h2 className={titleClass}>{copy.title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">{copy.intro}</p>

      <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {copy.points.map((point) => (
          <div key={point.title} className="border-t border-zinc-300 pt-4">
            <p className="font-semibold">{point.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{point.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 hidden overflow-hidden rounded-xl border border-zinc-200 bg-white md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs text-zinc-500">
              <th scope="col" className="w-[15%] px-4 py-3 font-medium" />
              {copy.columns.map((column) => (
                <th key={column} scope="col" className="px-4 py-3 font-medium">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {copy.rows.map((row) => (
              <tr key={row.name} className={`border-b border-zinc-100 last:border-b-0 ${rowTone(row)}`}>
                <th scope="row" className="px-4 py-3 align-top font-semibold">{row.name}</th>
                {row.values.map((value, index) => (
                  <td key={copy.columns[index]} className="px-4 py-3 align-top leading-relaxed">{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-3 md:hidden">
        {copy.rows.map((row) => (
          <div
            key={row.name}
            className={`rounded-xl border p-4 ${row.ours ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-700'}`}
          >
            <p className="font-semibold">{row.name}</p>
            <dl className="mt-2 grid gap-1.5 text-sm">
              {row.values.map((value, index) => (
                <div key={copy.columns[index]} className="grid grid-cols-[5.5rem_1fr] gap-2">
                  <dt className={row.ours ? 'text-zinc-400' : 'text-zinc-500'}>{copy.columns[index]}</dt>
                  <dd className="leading-relaxed">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-zinc-500">{copy.note}</p>
    </section>
  )
}
