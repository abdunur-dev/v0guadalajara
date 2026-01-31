import { ImageResponse } from "next/og";

export const runtime = "edge";

// OG Image dimensions (standard for most social platforms)
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Event details - you can edit these
const EVENT_CITY = "GUADALAJARA";
const EVENT_DATE = "FEBRUARY 2026";

interface Props {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{ u?: string }>;
}

// Decryption helper (same logic as lib/utils.ts)
function decryptLanyardData(encrypted: string): { username: string; variant: "dark" | "light" } | null {
  const OBFUSCATION_KEY = "v0gdl";
  
  if (!encrypted) return null;
  try {
    let base64 = encrypted.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (base64.length % 4)) % 4;
    base64 += "=".repeat(padding);
    
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    
    if (decoded.startsWith(`${OBFUSCATION_KEY}:`)) {
      const withoutKey = decoded.slice(OBFUSCATION_KEY.length + 1);
      const colonIndex = withoutKey.indexOf(":");
      if (colonIndex === -1) return null;
      
      const variant = withoutKey.slice(0, colonIndex) as "dark" | "light";
      const username = withoutKey.slice(colonIndex + 1);
      
      if (variant !== "dark" && variant !== "light") return null;
      
      return { username, variant };
    }
    return null;
  } catch {
    return null;
  }
}

export default async function Image({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const encrypted = resolvedSearchParams.u;
  const data = encrypted ? decryptLanyardData(encrypted) : null;
  
  const userName = data?.username || "ATTENDEE";
  const variant = data?.variant || "dark";
  
  const isDark = variant === "dark";
  const bgColor = isDark ? "#0a0a0a" : "#fafafa";
  const textColor = isDark ? "#ffffff" : "#000000";
  const mutedColor = isDark ? "#878787" : "#666666";
  const accentColor = isDark ? "#1a1a1a" : "#f0f0f0";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: bgColor,
          padding: "60px",
          fontFamily: "monospace",
        }}
      >
        {/* Left side - Event info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            flex: 1,
          }}
        >
          {/* Top - v0 branding */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: textColor,
                letterSpacing: "-0.02em",
              }}
            >
              v0 IRL
            </div>
            <div
              style={{
                fontSize: "20px",
                color: mutedColor,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Prompt to Production
            </div>
          </div>

          {/* Middle - User name (main focus) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                color: textColor,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                maxWidth: "500px",
                wordBreak: "break-word",
              }}
            >
              {userName}
            </div>
            <div
              style={{
                width: "80px",
                height: "4px",
                backgroundColor: textColor,
              }}
            />
          </div>

          {/* Bottom - City and date */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: textColor,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {EVENT_CITY}
            </div>
            <div
              style={{
                fontSize: "20px",
                color: mutedColor,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {EVENT_DATE}
            </div>
          </div>
        </div>

        {/* Right side - Decorative card mockup */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "400px",
            height: "100%",
          }}
        >
          {/* Lanyard card representation */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* Lanyard strap */}
            <div
              style={{
                width: "4px",
                height: "60px",
                backgroundColor: mutedColor,
              }}
            />
            {/* Card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "280px",
                height: "380px",
                backgroundColor: accentColor,
                borderRadius: "16px",
                padding: "32px",
                border: `2px solid ${isDark ? "#333" : "#ddd"}`,
              }}
            >
              {/* Card top - City */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: textColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {EVENT_CITY}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: mutedColor,
                    textTransform: "uppercase",
                  }}
                >
                  {EVENT_DATE}
                </div>
              </div>

              {/* Decorative geometric pattern */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    width: "120px",
                    height: "120px",
                    gap: "8px",
                  }}
                >
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: i % 2 === 0 ? textColor : "transparent",
                        borderRadius: "4px",
                        opacity: 0.3,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Card bottom - Name */}
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: textColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  textAlign: "right",
                }}
              >
                {userName.length > 15 ? userName.slice(0, 15) + "..." : userName}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
