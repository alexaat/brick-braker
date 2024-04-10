package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strconv"
)

func getData(page int) (*[]ScoreItem, error) {
	arr, err := getAllData()
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	l := len(arr)
	index1 := (page - 1) * maxItemsPerPage
	index2 := page * maxItemsPerPage
	if index1 > maxItemsPerPage {
		return &([]ScoreItem{}), nil
	}
	if index1 < 0 {
		index1 = 0
	}
	if index2 > l {
		index2 = l
	}
	paged := arr[index1:index2]
	return &paged, nil
}

func getAllData() ([]ScoreItem, error) {

	_, error := os.Stat(dbFilePath)
	if errors.Is(error, os.ErrNotExist) {

		f, err := os.Create(dbFilePath)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		d1 := []byte("[]")
		err = os.WriteFile(dbFilePath, d1, 0644)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		defer f.Close()
	}

	data, err := os.ReadFile("db.txt")
	if err != nil {
		return nil, err
	}
	var arr []ScoreItem
	err = json.Unmarshal(data, &arr)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	arr = sortScoreItems(arr)
	return arr, nil
}
func saveData(name string, scoreStr string, timeStr string) error {
	score, err := strconv.Atoi(scoreStr)
	if err != nil {
		return err
	}
	time, err := strconv.Atoi(timeStr)
	if err != nil {
		return err
	}
	data, err := getAllData()
	if err != nil {
		return err
	}
	lastId := 0
	for _, item := range data {
		if item.Id > lastId {
			lastId = item.Id
		}
	}
	data = append(data, ScoreItem{
		Id:    lastId + 1,
		Name:  name,
		Score: score,
		Time:  time,
	})
	b, err := json.Marshal(data)
	if err != nil {
		return err
	}
	err = os.WriteFile("db.txt", b, 0644)
	if err != nil {
		return err
	}
	return nil
}
