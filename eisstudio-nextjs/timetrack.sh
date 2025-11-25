#!/bin/bash

# Zeit-Tracking für Eisstudio Projekt
# Verwendung: ./timetrack.sh [start|pause|stop|status|log]

TRACK_FILE=".timetrack"
LOG_FILE="timetrack.log"

# Farben für Output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

format_time() {
    local total_seconds=$1
    local hours=$((total_seconds / 3600))
    local minutes=$(((total_seconds % 3600) / 60))
    local seconds=$((total_seconds % 60))
    printf "%02d:%02d:%02d" $hours $minutes $seconds
}

start_tracking() {
    if [ -f "$TRACK_FILE" ]; then
        source "$TRACK_FILE"
        if [ "$STATUS" = "running" ]; then
            echo -e "${YELLOW}⏱  Timer läuft bereits seit $(date -r $START_TIME '+%H:%M:%S')${NC}"
            return
        fi
    fi

    local now=$(date +%s)
    local accumulated=${ACCUMULATED:-0}

    echo "START_TIME=$now" > "$TRACK_FILE"
    echo "STATUS=running" >> "$TRACK_FILE"
    echo "ACCUMULATED=$accumulated" >> "$TRACK_FILE"
    echo "SESSION_START=$(date '+%Y-%m-%d %H:%M:%S')" >> "$TRACK_FILE"

    echo -e "${GREEN}▶  Timer gestartet um $(date '+%H:%M:%S')${NC}"
    if [ $accumulated -gt 0 ]; then
        echo -e "${BLUE}   Bisherige Zeit: $(format_time $accumulated)${NC}"
    fi
}

pause_tracking() {
    if [ ! -f "$TRACK_FILE" ]; then
        echo -e "${RED}✗  Kein Timer aktiv. Starte zuerst mit: ./timetrack.sh start${NC}"
        return
    fi

    source "$TRACK_FILE"

    if [ "$STATUS" = "paused" ]; then
        echo -e "${YELLOW}⏸  Timer ist bereits pausiert${NC}"
        echo -e "${BLUE}   Bisherige Zeit: $(format_time $ACCUMULATED)${NC}"
        return
    fi

    local now=$(date +%s)
    local session_time=$((now - START_TIME))
    local total=$((ACCUMULATED + session_time))

    echo "START_TIME=$START_TIME" > "$TRACK_FILE"
    echo "STATUS=paused" >> "$TRACK_FILE"
    echo "ACCUMULATED=$total" >> "$TRACK_FILE"
    echo "SESSION_START=$SESSION_START" >> "$TRACK_FILE"

    echo -e "${YELLOW}⏸  Timer pausiert${NC}"
    echo -e "${BLUE}   Diese Session: $(format_time $session_time)${NC}"
    echo -e "${BLUE}   Gesamt: $(format_time $total)${NC}"
}

stop_tracking() {
    if [ ! -f "$TRACK_FILE" ]; then
        echo -e "${RED}✗  Kein Timer aktiv${NC}"
        return
    fi

    source "$TRACK_FILE"

    local now=$(date +%s)
    local session_time=0
    local total=$ACCUMULATED

    if [ "$STATUS" = "running" ]; then
        session_time=$((now - START_TIME))
        total=$((ACCUMULATED + session_time))
    fi

    # In Log-Datei schreiben
    local log_entry="$(date '+%Y-%m-%d %H:%M:%S') | Dauer: $(format_time $total) | Session-Start: $SESSION_START"
    echo "$log_entry" >> "$LOG_FILE"

    echo -e "${RED}⏹  Timer gestoppt${NC}"
    echo -e "${BLUE}   Gesamtzeit: $(format_time $total)${NC}"
    echo -e "${GREEN}   ✓ Gespeichert in $LOG_FILE${NC}"

    rm "$TRACK_FILE"
}

show_status() {
    if [ ! -f "$TRACK_FILE" ]; then
        echo -e "${BLUE}ℹ  Kein Timer aktiv${NC}"
        if [ -f "$LOG_FILE" ]; then
            echo ""
            echo -e "${BLUE}Letzte Einträge:${NC}"
            tail -5 "$LOG_FILE"
        fi
        return
    fi

    source "$TRACK_FILE"

    local now=$(date +%s)
    local current_total=$ACCUMULATED

    if [ "$STATUS" = "running" ]; then
        local session_time=$((now - START_TIME))
        current_total=$((ACCUMULATED + session_time))
        echo -e "${GREEN}▶  Timer läuft${NC}"
    else
        echo -e "${YELLOW}⏸  Timer pausiert${NC}"
    fi

    echo -e "${BLUE}   Aktuelle Zeit: $(format_time $current_total)${NC}"
    echo -e "${BLUE}   Gestartet: $SESSION_START${NC}"
}

show_log() {
    if [ ! -f "$LOG_FILE" ]; then
        echo -e "${BLUE}ℹ  Noch keine Einträge vorhanden${NC}"
        return
    fi

    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}          ZEITERFASSUNG - EISSTUDIO        ${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo ""
    cat "$LOG_FILE"
    echo ""

    # Gesamtzeit berechnen
    local total_seconds=0
    while IFS= read -r line; do
        # Extrahiere die Zeit im Format HH:MM:SS
        time_str=$(echo "$line" | grep -oE '[0-9]{2}:[0-9]{2}:[0-9]{2}' | head -1)
        if [ -n "$time_str" ]; then
            hours=$(echo "$time_str" | cut -d: -f1 | sed 's/^0//')
            minutes=$(echo "$time_str" | cut -d: -f2 | sed 's/^0//')
            seconds=$(echo "$time_str" | cut -d: -f3 | sed 's/^0//')
            total_seconds=$((total_seconds + hours*3600 + minutes*60 + seconds))
        fi
    done < "$LOG_FILE"

    echo -e "${GREEN}═══════════════════════════════════════════${NC}"
    echo -e "${GREEN}   GESAMTSTUNDEN: $(format_time $total_seconds)${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════${NC}"
}

# Hauptlogik
case "$1" in
    start|s)
        start_tracking
        ;;
    pause|p)
        pause_tracking
        ;;
    stop|x)
        stop_tracking
        ;;
    status|?)
        show_status
        ;;
    log|l)
        show_log
        ;;
    *)
        echo ""
        echo -e "${BLUE}⏱  EISSTUDIO ZEIT-TRACKING${NC}"
        echo ""
        echo "Verwendung: ./timetrack.sh [befehl]"
        echo ""
        echo "Befehle:"
        echo "  start, s    Timer starten"
        echo "  pause, p    Timer pausieren"
        echo "  stop, x     Timer stoppen & speichern"
        echo "  status, ?   Aktuellen Status anzeigen"
        echo "  log, l      Alle Einträge anzeigen"
        echo ""
        ;;
esac
