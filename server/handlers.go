package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

func scoreHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		//Get param
		page_str := "1"
		if strings.Contains(r.URL.Path, "/score/") {
			page_str = strings.TrimSpace(strings.TrimPrefix(r.URL.Path, "/score/"))
		}
		page, err := strconv.Atoi(page_str)
		if err != nil {
			sendResponse(w, Status{Message: "error: Invalid Page Number"})
			return
		}
		data, err := getData(page)

		if err != nil {
			fmt.Println(err)
			sendResponse(w, Status{Message: "error " + err.Error()})
		} else {
			isLastPage := false
			//Check that it is last page
			if len(*data) < maxItemsPerPage {
				isLastPage = true
			} else {
				nextPageData, err := getData(page + 1)
				if err != nil {
					fmt.Println(err)
					sendResponse(w, Status{Message: "error " + err.Error()})
					return
				}
				if len(*nextPageData) == 0 {
					isLastPage = true
				}
			}

			allData, err := getAllData()
			if err != nil {
				fmt.Println(err)
				sendResponse(w, Status{Message: "error " + err.Error()})
			}
			response := Response{
				Page:       page,
				IsLastPage: isLastPage,
				Total:      len(allData),
				Payload:    data,
			}
			sendResponse(w, response)
		}
	} else if r.Method == "POST" {
		name := r.FormValue("name")
		score := r.FormValue("score")
		time := r.FormValue("time")
		err := saveData(name, score, time)
		if err != nil {
			sendResponse(w, Status{Message: "error: " + err.Error()})
			return
		}
		sendResponse(w, Status{Message: "success"})
	} else {
		sendResponse(w, Status{Message: "error: Wrong HTTP Method"})
	}
}
func sendResponse(w http.ResponseWriter, resp interface{}) {
	w.Header().Set("Access-Control-Allow-Origin", clientOrigin)
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	json.NewEncoder(w).Encode(resp)
}
func rankHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		sendResponse(w, Status{Message: "error: Wrong HTTP Method"})
		return
	}
	scoreStr := ""
	params, ok := r.URL.Query()["score"]
	if ok {
		scoreStr = params[0]
	}
	timeStr := ""
	params, ok = r.URL.Query()["time"]
	if ok {
		timeStr = params[0]
	}
	if scoreStr != "" && timeStr != "" {
		score, err := strconv.Atoi(scoreStr)
		if err != nil {
			fmt.Println(err)
			sendResponse(w, Status{Message: "error: Invalid Score"})
			return
		}
		time, err := strconv.Atoi(timeStr)
		if err != nil {
			fmt.Println(err)
			sendResponse(w, Status{Message: "error: Invalid Time"})
			return
		}
		data, err := getAllData()
		if err != nil {
			fmt.Println(err)
			sendResponse(w, Status{Message: "error " + err.Error()})
			return
		}
		newItem := ScoreItem{
			Id:    -1,
			Name:  "",
			Score: score,
			Time:  time,
		}
		data = append(data, newItem)
		data = sortScoreItems(data)
		//find rank for new score
		for i := 0; i < len(data); i++ {
			if data[i].Id == -1 {
				rank := Rank{
					Rank: i + 1,
				}
				sendResponse(w, rank)
				return
			}
		}
	}
	sendResponse(w, Status{Message: "error Cannot Get Rank"})
}
