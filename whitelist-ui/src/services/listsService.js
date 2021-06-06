import axiosInstance from '../clients/axiosClient'; 

const resource = "lists";

class ListService {

	static getWords(listName, pageNumber, pageSize, options) {
		const getPromise = axiosInstance.get(`${resource}/${listName}`, {
			params: {
				pageNumber,
				pageSize,
				search: options && options.search,
				sortBy: options && options.sortBy,
				ascending: options && options.ascending
			}
		});

		return getPromise;
	}

	static deleteWord(listName, word) {
		const deletePromise = axiosInstance.delete(`${resource}/${listName}/${word}`);

		return deletePromise;
	}

	static createOrUpdateWord(listName, word) {
		const postPromise = axiosInstance.post(`${resource}/${listName}`, { wordMetadata: word });

		return postPromise;
	}
}

export default ListService;
