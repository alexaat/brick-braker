package main

func sortScoreItems(arr []ScoreItem) []ScoreItem {
	isSorted := false
	for !isSorted {
		isSorted = true
		for i := 0; i < len(arr)-1; i++ {
			score1 := arr[i].Score
			score2 := arr[i+1].Score
			time1 := arr[i].Time
			time2 := arr[i+1].Time
			if score2 > score1 {
				//Swap
				item1 := arr[i]
				item2 := arr[i+1]
				arr[i+1] = item1
				arr[i] = item2
				isSorted = false
			} else if score2 == score1 {
				if time1 > time2 {
					//Swap
					item1 := arr[i]
					item2 := arr[i+1]
					arr[i+1] = item1
					arr[i] = item2
					isSorted = false
				}
			}
		}
	}
	return arr
}
