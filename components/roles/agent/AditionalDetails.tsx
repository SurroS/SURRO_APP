import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  getLocalNigeriaStates,
  getLocalNigeriaLgas,
} from "@/utils/states";

interface AdditionalProps {
  languages?: string[];
  experience?: string;
  specialization?: string;
  coverage?: any;
}

interface CoverageBlock {
  country: string;
  states: string;
  lgas?: string;
}

function parseCoverage(coverage: any): CoverageBlock[] {
  if (!coverage || !coverage.countries?.length) return [];

  const selectedStates: Record<string, string[]> = {};
  for (const s of coverage.states || []) {
    const parts = s.split(" > ");
    if (parts.length === 2) {
      const [c, st] = parts;
      if (!selectedStates[c]) selectedStates[c] = [];
      selectedStates[c].push(st);
    }
  }

  const selectedLgas: Record<string, string[]> = {};
  for (const l of coverage.LGAs || []) {
    const parts = l.split(" > ");
    if (parts.length === 3) {
      const [c, st, lga] = parts;
      const key = `${c}::${st}`;
      if (!selectedLgas[key]) selectedLgas[key] = [];
      selectedLgas[key].push(lga);
    }
  }

  const blocks: CoverageBlock[] = [];
  for (const country of coverage.countries) {
    const states = selectedStates[country];
    if (!states?.length) {
      blocks.push({ country, states: "Not specified", lgas: undefined });
      continue;
    }

    const allStates = country === "Nigeria" ? getLocalNigeriaStates() : null;
    const statesText =
      allStates && states.length >= allStates.length
        ? `All ${allStates.length} states`
        : states.join(", ");

    let lgasText: string | undefined;
    const anyLgas = coverage.LGAs?.some((l: string) =>
      l.startsWith(country + " > "),
    );

    if (anyLgas) {
      const allLgasAllStates = states.every((st) => {
        const key = `${country}::${st}`;
        const sel = selectedLgas[key];
        const total = country === "Nigeria" ? getLocalNigeriaLgas(st) : null;
        return total && total.length > 0 && sel?.length >= total.length;
      });

      if (allLgasAllStates) {
        const totalAll = states.reduce((sum, st) => {
          const total = country === "Nigeria" ? getLocalNigeriaLgas(st) : null;
          return sum + (total?.length || 0);
        }, 0);
        lgasText = `All ${totalAll} LGAs`;
      } else {
        const perState: string[] = [];
        for (const st of states) {
          const key = `${country}::${st}`;
          const sel = selectedLgas[key];
          if (sel?.length) {
            const total =
              country === "Nigeria" ? getLocalNigeriaLgas(st) : null;
            if (total && sel.length >= total.length) {
              perState.push(`${st}: all LGAs`);
            } else {
              perState.push(`${st}: ${sel.join(", ")}`);
            }
          }
        }
        lgasText = perState.join("; ");
      }
    }

    blocks.push({ country, states: statesText, lgas: lgasText });
  }
  return blocks;
}

function renderCoverageFallback(coverage: any): string {
  if (!coverage) return "-";
  if (typeof coverage === "string") return coverage;
  if (Array.isArray(coverage)) {
    return coverage
      .map((c: any) => {
        if (typeof c === "string") return c;
        const country = c.country || c.name || "";
        const states = c.states?.length
          ? c.states
              .map((s: any) => (typeof s === "string" ? s : s.name || ""))
              .join(", ")
          : "";
        return states ? `${country} (${states})` : country;
      })
      .join("; ");
  }
  return String(coverage);
}

export default function AgentAdditionalDetails({
  languages,
  experience,
  specialization,
  coverage,
}: AdditionalProps) {
  const Row = ({ label, value }:{label:any, value:any}) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Additional Details</Text>

      <Row label="Languages spoken" value={languages?.join(", ")} />
      <Row label="Years of experience" value={experience} />
      <Row label="Specialization" value={specialization} />
      {(() => {
        const blocks = parseCoverage(coverage);
        if (blocks.length === 0) {
          return <Row label="Coverage location" value={renderCoverageFallback(coverage)} />;
        }
        return (
          <View style={styles.coverageBlock}>
            <Text style={styles.label}>Coverage location:</Text>
            {blocks.map((b) => (
              <View key={b.country} style={styles.coverageItem}>
                <Text style={styles.coverageLine}>Country: {b.country}</Text>
                <Text style={styles.coverageLine}>States: {b.states}</Text>
                {b.lgas && (
                  <Text style={styles.coverageLine}>LGAs: {b.lgas}</Text>
                )}
              </View>
            ))}
          </View>
        );
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    color: "#444",
  },
  value: {
    color: "#555",
    flexShrink: 1,
    textAlign: "right",
  },
  coverageBlock: {
    marginTop: 4,
  },
  coverageItem: {
    marginTop: 6,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#ccc",
  },
  coverageLine: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },
});
