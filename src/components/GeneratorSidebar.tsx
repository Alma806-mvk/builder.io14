import React, { useState } from "react";
import { HistoryItem, ContentType } from "../../types";
import { CONTENT_TYPES } from "../../constants";
import {
  ListChecksIcon,
  TrashIcon,
  StarIcon,
  PlusCircleIcon,
  SearchIcon,
  ClockIcon,
  TagIcon,
} from "./IconComponents";

interface GeneratorSidebarProps {
  history: HistoryItem[];
  viewingHistoryItemId: string | null;
  onViewHistoryItem: (item: HistoryItem) => void;
  onToggleFavorite: (id: string) => void;
  onPinToCanvas: (item: HistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearAppHistory: () => void;
}

export const GeneratorSidebar: React.FC<GeneratorSidebarProps> = ({
  history,
  viewingHistoryItemId,
  onViewHistoryItem,
  onToggleFavorite,
  onPinToCanvas,
  onDeleteHistoryItem,
  onClearAppHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites" | "recent">("all");

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(diffDays > 365 ? { year: "numeric" } : {}),
    });
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Filter and search history
  const filteredHistory = React.useMemo(() => {
    let filtered = history.filter((item) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesInput = item.userInput.toLowerCase().includes(query);
        const matchesType = item.contentType.toLowerCase().includes(query);
        const matchesPlatform = item.platform.toLowerCase().includes(query);
        if (!matchesInput && !matchesType && !matchesPlatform) return false;
      }

      // Category filter
      switch (filter) {
        case "favorites":
          return item.isFavorite;
        case "recent":
          const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
          return item.timestamp > dayAgo;
        default:
          return true;
      }
    });

    // Sort by newest first
    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }, [history, searchQuery, filter]);

  const favoriteCount = history.filter((item) => item.isFavorite).length;
  const recentCount = history.filter((item) => {
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return item.timestamp > dayAgo;
  }).length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0f172a",
        color: "#e2e8f0",
        borderLeft: "1px solid #1e293b",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <ListChecksIcon
            style={{ width: "1.25rem", height: "1.25rem", color: "#3b82f6" }}
          />
          <h3
            style={{
              margin: 0,
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "#f1f5f9",
            }}
          >
            History
          </h3>
        </div>
        <span
          style={{
            background: "#1e293b",
            color: "#94a3b8",
            padding: "0.25rem 0.75rem",
            borderRadius: "1rem",
            fontSize: "0.75rem",
            fontWeight: "500",
          }}
        >
          {history.length}
        </span>
      </div>

      {/* Search */}
      <div
        style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #1e293b" }}
      >
        <div style={{ position: "relative" }}>
          <SearchIcon
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: "1rem",
              height: "1rem",
              color: "#64748b",
            }}
          />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 0.75rem 0.75rem 2.5rem",
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "0.5rem",
              color: "#e2e8f0",
              fontSize: "0.875rem",
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      {/* Filters */}
      <div
        style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #1e293b" }}
      >
        <div style={{ display: "flex", gap: "0.25rem" }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              flex: 1,
              padding: "0.5rem 0.75rem",
              background: filter === "all" ? "#3b82f6" : "transparent",
              color: filter === "all" ? "white" : "#64748b",
              border: `1px solid ${filter === "all" ? "#3b82f6" : "#334155"}`,
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "500",
              fontFamily: "inherit",
            }}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setFilter("favorites")}
            style={{
              flex: 1,
              padding: "0.5rem 0.75rem",
              background: filter === "favorites" ? "#3b82f6" : "transparent",
              color: filter === "favorites" ? "white" : "#64748b",
              border: `1px solid ${filter === "favorites" ? "#3b82f6" : "#334155"}`,
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.375rem",
              fontFamily: "inherit",
            }}
          >
            <StarIcon style={{ width: "0.875rem", height: "0.875rem" }} />
            {favoriteCount}
          </button>
          <button
            onClick={() => setFilter("recent")}
            style={{
              flex: 1,
              padding: "0.5rem 0.75rem",
              background: filter === "recent" ? "#3b82f6" : "transparent",
              color: filter === "recent" ? "white" : "#64748b",
              border: `1px solid ${filter === "recent" ? "#3b82f6" : "#334155"}`,
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.375rem",
              fontFamily: "inherit",
            }}
          >
            <ClockIcon style={{ width: "0.875rem", height: "0.875rem" }} />
            {recentCount}
          </button>
        </div>
      </div>

      {/* History List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.5rem",
        }}
      >
        {filteredHistory.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "3rem 1.5rem",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            {searchQuery || filter !== "all" ? (
              <div>
                <SearchIcon
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    color: "#475569",
                    marginBottom: "1rem",
                  }}
                />
                <p
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontWeight: "500",
                    color: "#94a3b8",
                  }}
                >
                  No items match your search
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilter("all");
                  }}
                  style={{
                    marginTop: "1rem",
                    background: "transparent",
                    color: "#3b82f6",
                    border: "1px solid #3b82f6",
                    borderRadius: "0.375rem",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontFamily: "inherit",
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div>
                <ListChecksIcon
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    color: "#475569",
                    marginBottom: "1rem",
                  }}
                />
                <p
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontWeight: "500",
                    color: "#94a3b8",
                  }}
                >
                  No history yet
                </p>
                <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                  Generated content will appear here
                </span>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => onViewHistoryItem(item)}
                style={{
                  background:
                    viewingHistoryItemId === item.id ? "#1e40af" : "#1e293b",
                  border: `1px solid ${viewingHistoryItemId === item.id ? "#3b82f6" : "#334155"}`,
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
                onMouseEnter={(e) => {
                  if (viewingHistoryItemId !== item.id) {
                    e.currentTarget.style.background = "#334155";
                    e.currentTarget.style.borderColor = "#475569";
                  }
                }}
                onMouseLeave={(e) => {
                  if (viewingHistoryItemId !== item.id) {
                    e.currentTarget.style.background = "#1e293b";
                    e.currentTarget.style.borderColor = "#334155";
                  }
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <TagIcon
                      style={{
                        width: "0.875rem",
                        height: "0.875rem",
                        color: "#64748b",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        color: "#cbd5e1",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {CONTENT_TYPES.find((ct) => ct.value === item.contentType)
                        ?.label || item.contentType}
                    </span>
                  </div>
                  <div
                    style={{
                      background:
                        viewingHistoryItemId === item.id
                          ? "#2563eb"
                          : "#334155",
                      color:
                        viewingHistoryItemId === item.id ? "white" : "#94a3b8",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.625rem",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.platform}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.875rem",
                      lineHeight: 1.4,
                      color:
                        viewingHistoryItemId === item.id
                          ? "#f1f5f9"
                          : "#e2e8f0",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {truncateText(item.userInput, 80)}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "0.75rem",
                      color: "#64748b",
                    }}
                  >
                    <ClockIcon
                      style={{ width: "0.75rem", height: "0.75rem" }}
                    />
                    {formatTimestamp(item.timestamp)}
                  </div>

                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: "0.375rem",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        color: item.isFavorite ? "#fbbf24" : "#94a3b8",
                      }}
                    >
                      <StarIcon
                        style={{ width: "0.875rem", height: "0.875rem" }}
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPinToCanvas(item);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: "0.375rem",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        color: "#94a3b8",
                      }}
                    >
                      <PlusCircleIcon
                        style={{ width: "0.875rem", height: "0.875rem" }}
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistoryItem(item.id);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: "0.375rem",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        color: "#94a3b8",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#dc2626";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#94a3b8";
                      }}
                    >
                      <TrashIcon
                        style={{ width: "0.875rem", height: "0.875rem" }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {history.length > 0 && (
        <div style={{ padding: "1.5rem", borderTop: "1px solid #1e293b" }}>
          <button
            onClick={onClearAppHistory}
            style={{
              width: "100%",
              background: "transparent",
              color: "#ef4444",
              border: "1px solid #dc2626",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#dc2626";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#ef4444";
            }}
          >
            <TrashIcon style={{ width: "1rem", height: "1rem" }} />
            Clear All History
          </button>
        </div>
      )}
    </div>
  );
};
